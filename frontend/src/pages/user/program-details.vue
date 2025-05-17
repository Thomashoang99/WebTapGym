<template>
  <div class="program-detail-page">
    <section v-if="loading" class="status">Loading…</section>
    <section v-else-if="error" class="status error">{{ error }}</section>
    <section v-else>
      <!-- Header -->
      <header class="detail-header">
        <h1>{{ program.name }}</h1>
        <p class="meta">
          <span>{{ program.duration }} week(s)</span>
          •
          <span>{{ program.difficulty }}</span>
        </p>
      </header>

      <div v-if="program.isPaid && !program.purchased" class="preview">
        <p>This program is paid!</p>
        <button class="button-primary" @click="addToCart">Buy Now</button>
      </div>

      <div v-else class="details">
        <p class="description">{{ program.description }}</p>

        <h2>Exercises List</h2>
        <ul class="exercise-list">
          <li v-for="(ex, index) in program.exercises" :key="ex._id" class="exercise">
            <h2><span>{{ index + 1 }} </span>. {{ ex.exercise.name }}</h2>
            <p>Sets: {{ ex.sets }}, Reps: {{ ex.reps }}</p>
            <iframe           
              v-if="ex.exercise.videoUrl"
              :src="ex.exercise.videoUrl.replace('watch?v=', 'embed/')"
              loading="lazy"
              frameborder="0"
            ></iframe>
          </li>
        </ul>

        <!-- Notes & Progress -->
        <div class="progress-section">
          <h2>User Notes</h2>

          <label for="prog-notes">Notes</label>
          <textarea
            id="prog-notes"
            v-model="form.notes"
            placeholder="Write your notes here…"
            style="resize: vertical;"
          ></textarea>

          <label for="prog-level">
            Progress: {{ form.progress }}%
            <input
              id="prog-level"
              type="range"
              min="0" max="100"
              v-model.number="form.progress"
            />
          </label>

          <button class="button-secondary" style="margin-top: 1rem;" @click="saveProgress" :disabled="saving">
            <span v-if="!saving">Save</span>
            <span v-else>Saving…</span>
          </button>

          <div v-if="saveError" class="error">{{ saveError }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cartStore';
import api from '../../api';

const route  = useRoute();
const router = useRouter();
const cart   = useCartStore();

const loading = ref(true);
const error   = ref('');

const program  = ref(null);
const form     = reactive({ notes: '', progress: 0 });
const saving   = ref(false);
const saveError= ref('');

async function fetchDetails() {
  loading.value = true;
  try {
    const { id } = route.params;

    const resProg = await api.get(`/shared/program/${id}`);
    program.value = resProg.data;

    if (!program.value.isPaid || program.value.purchased) {
      const resProgP = await api.get(`/user/program/${id}/progress`);
      form.notes    = resProgP.data.notes;
      form.progress = resProgP.data.progress;
    }
  } catch (err) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    loading.value = false;
  }
}

function addToCart() {
  cart.addToCart(program.value);
  router.push('/checkout');
}

async function saveProgress() {
  saving.value = true;
  saveError.value = '';
  try {
    const { id } = route.params;
    const result = await api.put(`/user/program/${id}/progress`, {
      notes:    form.notes,
      progress: form.progress
    });
    if (result.statusText === 'OK'){
        alert('Đã lưu ghi chú và tiến độ của chương trình này!');
    }
  } catch (err) {
    saveError.value = err.response?.data?.error || err.message;
  } finally {
    saving.value = false;
  }
}

onMounted(fetchDetails);
</script>

<style scoped>
.program-detail-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
.status {
  text-align: center;
  padding: 2rem;
}
.status.error { color: #f44336; }

/* Header */
.detail-header h1 {
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.detail-header .meta {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

/* Preview for paid programs */
.preview {
  background: var(--background-secondary);
  padding: 1rem;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 2rem;
}

/* Description & exercises */
.description {
  margin-bottom: 1.5rem;
}
.exercise-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
}
.exercise {
  margin: 1rem 0;
}
.exercise h3 {
  margin-bottom: 0.25rem;
}
.exercise iframe {
  width: 100%;
  height: 50vh;
  border: none;
  margin-top: 0.5rem;
}

/* Notes & Progress */
.progress-section {
  background: var(--background-secondary);
  padding: 1rem;
  border-radius: 4px;
}
.progress-section h2 {
  margin-bottom: 1rem;
}
.progress-section label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
  color: var(--text-secondary);
}
.progress-section textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  background: var(--background-main);
  color: var(--text-primary);
  border: 1px solid #333;
  border-radius: 4px;
}
.progress-section input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: var(--background-main);
  border-radius: 4px;
  outline: none;
  margin-top: 0.5rem;
}

/* Track */
.progress-section input[type="range"]::-webkit-slider-runnable-track {
  height: 4px;
  background: var(--text-primary);
  border-radius: 2px;
}
.progress-section input[type="range"]::-moz-range-track {
  height: 4px;
  background: var(--accent-secondary);
  border-radius: 2px;
}

.progress-section input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--accent-primary);
  border-radius: 50%;
  border: none;
  margin-top: -4px; 
  cursor: pointer;
}
.progress-section input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--accent-primary);
  border-radius: 50%;
  border: none;
  cursor: pointer;
}
.progress-section .error {
  margin-top: 0.5rem;
  color: #f44336;
}
</style>
