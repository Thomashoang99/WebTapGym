<template>
  <div class="program-form-page">
    <h3 class="header">
      {{ props.readOnly ? 'View ' : isEditing? 'Edit ' : 'New ' }}Program
    </h3>
    <form @submit.prevent="save">
      <!-- Name -->
      <div class="field">
        <h5>Name</h5>
        <input
          type="text"
          v-model="form.name"
          :disabled="props.readOnly"
          required
        />
      </div>

      <!-- Description -->
      <div class="field">
        <h5>Description</h5>
        <textarea
          v-model="form.description"
          :disabled="props.readOnly"
          required
        ></textarea>
      </div>

      <!-- Difficulty -->
      <div class="field">
        <h5>Difficulty</h5>
        <select
          v-model="form.difficulty"
          :disabled="props.readOnly"
          required
        >
          <option disabled value="">Select one</option>
          <option
            v-for="d in difficultyList"
            :key="d"
            :value="d"
          >
            {{ d }}
          </option>
        </select>
      </div>

      <!-- Duration (weeks) -->
      <div class="field">
        <h5>Duration (weeks)</h5>
        <input
          type="number"
          min="1"
          v-model.number="form.duration"
          :disabled="props.readOnly"
          required
        />
      </div>

      <!-- Exercises List -->
      <div class="field exercises-list">
        <h5>Exercises</h5>
        <div
          v-for="(ex, idx) in form.exercises"
          :key="idx"
          class="exercise-entry"
        >
          <select
            v-model="ex.exercise"
            :disabled="props.readOnly"
            required
          >
            <option disabled value="">Select exercise</option>
            <option
              v-for="item in cachedList"
              :key="item._id"
              :value="item._id"
            >
              {{ item.name }}
            </option>
          </select>
          <input
            type="number"
            min="1"
            v-model.number="ex.sets"
            :disabled="props.readOnly"
            placeholder="Sets"
            required
          />
          <input
            type="text"
            v-model="ex.reps"
            :disabled="props.readOnly"
            placeholder="Reps (e.g. 8-12)"
            required
          />
          <button
            v-if="!props.readOnly"
            type="button"
            @click="removeExercise(idx)"
            class="btn-delete"
          >
            Remove
          </button>
        </div>
        <button
          v-if="!props.readOnly"
          type="button"
          @click="addExercise"
          class="button-secondary"
        >
          + Add Exercise
        </button>
      </div>

      <!-- Paid Toggle & Price -->
      <div class="field toggle">
          <input type="checkbox" v-model="form.isPaid" :disabled="props.readOnly">&nbsp;Paid Program
      </div>
      <div class="field" v-if="form.isPaid">
        <h5>Price (VND)</h5>
        <input
          type="number"
          min="0" step="1000"
          v-model.number="form.price"
          :disabled="props.readOnly"
          required
        />
      </div>

      <!-- Actions -->
      <button
        v-if="!props.readOnly"
        class="button-primary"
        type="submit"
        :disabled="saving"
      >
        {{ saving
          ? 'Saving…'
          : isEditing
          ? 'Update'
          : 'Create' }}
      </button>
      <button
        class="button-secondary"
        type="button"
        @click="emit('close')"
      >
        Cancel
      </button>

      <div v-if="error" class="status error">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { defineProps, defineEmits } from 'vue';
import api from '../../api';
import { useExerciseStore } from '../../stores/exerciseStore';

const exerciseStore = useExerciseStore();
const cachedList = computed(() => exerciseStore.exerciseList);

const props = defineProps({
  programId: { type: String, default: null },
  readOnly: { type: Boolean, default: false }
});
const emit = defineEmits(['saved', 'close']);

const isEditing = computed(() => !!props.programId);
const difficultyList = ['Beginner', 'Intermediate', 'Advanced'];

const form = reactive({
  name: '',
  description: '',
  difficulty: '',
  duration: 1,
  exercises: [],
  isPaid: false,
  price: 0
});

const saving = ref(false);
const error = ref('');

function addExercise() {
  form.exercises.push({ exercise: '', sets: 1, reps: '' });
}

function removeExercise(idx) {
  form.exercises.splice(idx, 1);
}

onMounted(async () => {
  try {
    await exerciseStore.fetchExercises();

    if (isEditing.value || props.readOnly) {
      const { data } = await api.get(`/admin/program/${props.programId}`);
      console.log(data);
      Object.assign(form, {
        name: data.name,
        description: data.description,
        difficulty: data.difficulty,
        duration: data.duration,
        exercises: data.exercises.map(e => ({
          exercise: e.exercise._id,
          sets: e.sets,
          reps: e.reps
        })),
        isPaid: data.isPaid,
        price: data.price || 0
      });
    }
  } catch (err) {
    error.value = err.response?.data?.error || err.message;
  }
});

async function save() {
  saving.value = true;
  error.value = '';
  try {
    const data = {
      name: form.name,
      description: form.description,
      difficulty: form.difficulty,
      duration: form.duration,
      exercises: form.exercises,
      isPaid: form.isPaid,
      price: form.isPaid ? form.price : 0
    };

    if (isEditing.value) {
      await api.put(`/admin/program/${props.programId}`, data);
    } else {
      await api.post('/admin/program', data);
    }
    emit('saved');
  } catch (err) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
* {
  color: var(--text-primary);
}

.field {
  margin-bottom: 1rem;
}
.field h5 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}
.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 0.5rem;
  background: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid #333;
  border-radius: 4px;
}
.exercises-list .exercise-entry {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.75rem;
}
.status.error {
  color: #f44336;
  margin-top: 1rem;
}
.field.toggle
{
  text-align: left;
}
.field input[type='checkbox']{
  width: auto;
  padding: 0;
}
.btn-delete{
  padding: 0.5rem;
}
</style>
