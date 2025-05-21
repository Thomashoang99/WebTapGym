<template>
  <div class="exercise-form-page">
    <h3 class="header">{{ props.readOnly ? 'View ' : (isEditing ? 'Edit ' : 'New ') }}Exercise</h3>
    <form @submit.prevent="save" enctype="multipart/form-data">
      <!-- Name -->
      <div class="field">
        <h5>Name</h5>
        <input type="text" v-model="form.name" :disabled="props.readOnly" required />
      </div>

      <!-- Description -->
      <div class="field">
        <h5>Description</h5>
        <textarea v-model="form.description" :disabled="props.readOnly" required></textarea>
      </div>

      <!-- Image Upload -->
      <div class="field">
        <h5>Image</h5>
        <input type="file" @change="onFileChange" :disabled="props.readOnly" accept="image/*" />
        <img v-if="preview" :src="preview"  class="preview-img" />
      </div>

      <!-- Body Parts -->
      <div class="field">
        <h5>Body Parts</h5>
        <div class="checkbox-list">
          <label v-for="part in bodyPartsList" :key="part">
            <input type="checkbox" :value="part" :disabled="props.readOnly" v-model="form.bodyParts" />
            {{ part }}
          </label>
        </div>
      </div>

      <!-- Equipment -->
      <div class="field">
        <h5>Equipment</h5>
        <select v-model="form.equipment" :disabled="props.readOnly" required>
          <option disabled value="">Select one</option>
          <option v-for="e in equipmentList" :key="e" :value="e">{{ e }}</option>
        </select>
      </div>

      <!-- Difficulty -->
      <div class="field">
        <h5>Difficulty</h5>
        <select v-model="form.difficulty" :disabled="props.readOnly" required>
          <option disabled value="">Select one</option>
          <option v-for="d in difficultyList" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>

      <!-- Video URL -->
      <div class="field">
        <h5>Video URL</h5>
        <input v-model="form.videoUrl" type="url" :disabled="props.readOnly" placeholder="https://..." />
      </div>

      <!-- Actions -->
      <button class="button-primary" type="submit" :disabled="saving">
        {{ saving ? 'Saving…' : isEditing ? 'Update' : 'Create' }}
      </button>
      <button class="button-secondary" type="button" @click="emit('close')">
        Cancel
      </button>

      <div v-if="error" class="status error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../api';
import { useExerciseStore } from '../../stores/exerciseStore';

const exerciseStore = useExerciseStore();
const props = defineProps({
  exerciseId: { type: String, default: null },
  readOnly:  { type: Boolean, default: false }
});
const emit = defineEmits(['saved',  'close']);

const route    = useRoute();
const router   = useRouter();
const isEditing = computed(() => !!props.exerciseId);

const bodyPartsList = ['Full Body','Back','Chest','Shoulders','Biceps','Triceps','Core','Legs'];
const equipmentList = ['Barbell','Dumbbell','Machine','Bodyweight'];
const difficultyList= ['Beginner','Intermediate','Advanced'];

const form = reactive({
  name:       '',
  description:'',
  bodyParts:  [],
  equipment:  '',
  difficulty: '',
  videoUrl:   ''
});
const file    = ref(null);
const preview = ref('');
const saving  = ref(false);
const error   = ref('');

function onFileChange(e) {
  const f = e.target.files[0];
  if (f) {
    file.value = f;
    preview.value = URL.createObjectURL(f);
  }
}

onMounted(async () => {
  if (isEditing.value || props.readOnly) {
    try {
      const { data } = await api.get(`/shared/exercise/${props.exerciseId}`);
      Object.assign(form, {
        name: data.name,
        description: data.description,
        bodyParts: data.bodyParts,
        equipment: data.equipment,
        difficulty: data.difficulty,
        videoUrl: data.videoUrl || ''
      });
      console.log(form);
      preview.value = data.imageUrl || '';
    } catch (err) {
      error.value = err.response?.data?.error || err.message;
    }
  }
});

async function save() {
  saving.value = true;
  error.value = '';
  const fd = new FormData();
  fd.append('name', form.name);
  fd.append('description', form.description);
  form.bodyParts.forEach(bp => fd.append('bodyParts', bp));
  fd.append('equipment', form.equipment);
  fd.append('difficulty', form.difficulty);
  if (form.videoUrl) fd.append('videoUrl', form.videoUrl);
  if (file.value)    fd.append('image', file.value);

  try {
    if (isEditing.value) {
      await api.put(`/admin/exercise/${props.exerciseId}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      await api.post('/admin/exercise', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    exerciseStore.clearCache();
    emit('saved');
  } catch (err) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    saving.value = false;
  }
}

function cancel() {
  router.push('/admin/exercises');
}
</script>

<style scoped>
* {
  color: var(--text-primary);
}
.field {
  margin-bottom: 1rem;
}
.field label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}
.field input[type="text"],
.field input[type="url"],
.field select,
.field textarea {
  width: 100%;
  padding: 0.5rem;
  background: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid #333;
  border-radius: 4px;
}
.checkbox-list label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}
.preview-img {
  max-width: 150px;
  margin-top: 0.5rem;
  border-radius: 4px;
}
.status.error {
  color: #f44336;
  margin-top: 1rem;
}
</style>
