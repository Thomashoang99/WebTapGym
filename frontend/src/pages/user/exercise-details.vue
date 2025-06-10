<template>
  <div class="exercise-detail-page">
    <div v-if="loading" class="status">Loading…</div>
    <div v-else-if="error" class="status error">{{ error }}</div>
    <div v-else class="content">
      <h2 class="title">{{ exercise.name }}</h2>
      <img
        v-if="exercise.imageUrl"
        :src="exercise.imageUrl"
        :alt="exercise.name"
        class="image"
      />

      <div class="meta">
        <div class="tags">
          <span v-for="part in exercise.bodyParts" :key="part" class="tag">
            {{ part }}
          </span>
        </div>
        <p class="info">
          <strong>Equipment:</strong> {{ exercise.equipment }}
          &nbsp;|&nbsp;
          <strong>Difficulty:</strong> {{ exercise.difficulty }}
        </p>
      </div>

      <p class="description">{{ exercise.description }}</p>

      <div v-if="exercise.videoUrl" class="video-container">
        <iframe
          :src="exercise.videoUrl.replace('watch?v=', 'embed/')"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    <button class="button-primary back-btn" @click="goBack()">← Back</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../api";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const exercise = ref(null);
const loading = ref(true);
const error = ref("");

function goBack() {
  router.back();
}

async function fetchExercise() {
  loading.value = true;
  error.value = "";
  try {
    const { data } = await api.get(`/shared/exercise/${id}`);
    exercise.value = data;
  } catch (err) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchExercise);
</script>

<style scoped>
.exercise-detail-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: var(--text-primary);
}

.back-btn {
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.status {
  font-size: 1.25rem;
  text-align: center;
}

.status.error {
  color: #f44336;
}

.content .title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: var(--background-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.info {
  font-size: 1rem;
}

.description {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 8px;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
