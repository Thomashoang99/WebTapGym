<template>
  <div class="exercise-page">
    <aside class="filter-bar">
      <h2>Filters</h2>

      <section>
        <h3>Body Parts</h3>
        <div v-for="option in bodyPartOptions" :key="option" class="filter-option">
          <label>
            <input
              type="checkbox"
              v-model="selectedBodyParts"
              :value="option"
            />
            {{ option }}
          </label>
        </div>
      </section>

      <section>
        <h3>Equipment</h3>
        <select v-model="selectedEquipment" class="filter-select">
          <option value="">All</option>
          <option v-for="option in equipmentOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </section>

      <section>
        <h3>Difficulty</h3>
        <select v-model="selectedDifficulty" class="filter-select">
          <option value="">All</option>
          <option v-for="option in difficultyOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </section>

      <section>
        <h3>Sort By</h3>
        <select v-model="selectedSortBy" class="filter-select">
          <option v-for="opt in sortByOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </section>

      <section>
        <h3>Order</h3>
        <select v-model="selectedSortOrder" class="filter-select">
          <option v-for="opt in sortOrderOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </section>
    </aside>

    <section class="result-grid">
    <main class="exercise-list">
      <div v-if="loading" class="loading">Loading exercises...</div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="!loading && !error && exercises.length === 0" class="no-results">
        No exercises found.
      </div>

      <div v-else class="grid">
        <Card v-for="ex in exercises" :key="ex._id" :exercise="ex"/>
      </div>

      <div class="pagination">
        <button  @click="prevPage" :disabled="currentPage === 1">
          ◄
        </button>
        <span> {{ currentPage }} / {{ totalPages }} </span>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          ►
        </button>
      </div>
    </main>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '../api';
import Card from '../components/card.vue';

// Filter and sort options
const bodyPartOptions = [
  'Full Body',
  'Back',
  'Chest',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Core',
  'Legs'
];
const equipmentOptions = [
  'Barbell',
  'Dumbbell',
  'Machine',
  'Bodyweight'
];
const difficultyOptions = [
  'Beginner',
  'Intermediate',
  'Advanced'
];
const sortByOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Date Created', value: 'createdAt' }
];
const sortOrderOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' }
];

// Reactive state
const selectedBodyParts = ref([]);
const selectedEquipment = ref('');
const selectedDifficulty = ref('');
const selectedSortBy = ref('createdAt');
const selectedSortOrder = ref('desc');
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);

const exercises = ref([]);
const loading = ref(false);
const error = ref(null);

async function fetchExercises() {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      sortBy: selectedSortBy.value,
      sortOrder: selectedSortOrder.value
    };
    if (selectedBodyParts.value.length) {
      params.bodyParts = selectedBodyParts.value.join(',');
    }
    if (selectedEquipment.value) {
      params.equipment = selectedEquipment.value;
    }
    if (selectedDifficulty.value) {
      params.difficulty = selectedDifficulty.value;
    }

    const { data } = await api.get('/shared/exercise', { params });
    exercises.value = data.results;
    totalPages.value = data.totalPages;
  } catch (err) {
    error.value = 'Failed to load exercises.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchExercises);

watch(
  [
    selectedBodyParts,
    selectedEquipment,
    selectedDifficulty,
    selectedSortBy,
    selectedSortOrder
  ],
  () => {
    currentPage.value = 1;
    fetchExercises();
  }
);

// Watch page changes to refetch
watch(currentPage, fetchExercises);

// Pagination handlers
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
</script>

<style>
.exercise-page {
  width: 100%;
  display: flex;
  min-height: 100vh;
}

.filter-bar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  flex: 1;
  padding: 16px;
  border-right: 1px solid #ddd;
}

.result-grid {
  flex: 5;
}

.exercise-list {
  width: 100%;
  padding: 16px;
}

.loading,
.error,
.no-results {
  text-align: center;
  margin-top: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.pagination button {
  all: unset;
  cursor: pointer;
  padding: 6px 12px;
}
</style>
