<template>
    <div>
    <h1 class="header">My Progress Tracker</h1>
    <div class="progress-tracking-page">
        <aside class="sort-sidebar">
        <h2>Sort By</h2>
        <section>
            <label><input type="radio" v-model="sortBy" value="name"/> Name</label>
            <label><input type="radio" v-model="sortBy" value="progress"/> Progress</label>
        </section>
        <section>
        <h2>Order</h2>
        <select v-model="selectedSortOrder" class="filter-select">
          <option v-for="opt in sortOrderOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </section>
    </aside>
    <section v-if="loading" class="status">Loading…</section>
    <section v-else-if="error" class="status error">{{ error }}</section>
    <section v-else>
      <div v-if="programs.length === 0" class="empty">
        You haven’t purchased any programs yet.
      </div>

      <div v-else class="programs-grid">
        <div
          v-for="prog in sortedPrograms"
          :key="prog._id"
          class="program-card"
        >
          <h2>{{ prog.name }}</h2>
          <p class="desc">{{ prog.description }}</p>

          <div class="progress-wrapper">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: prog.progress + '%' }"
              ></div>
            </div>
            <span class="progress-label">{{ prog.progress }}%</span>
          </div>

          <button class="button-primary" @click="viewDetail(prog._id)">
            View Details
          </button>
        </div>
      </div>
    </section>
    </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api';

const router   = useRouter();
const loading  = ref(true);
const error    = ref('');
const programs = ref([]);

const sortBy = ref('name');
const sortedPrograms = computed(() => {
  return [...programs.value].sort((a, b) => {
    if (sortBy.value === 'name') {
      return selectedSortOrder.value * (a.name.localeCompare(b.name));
    } else {
      return selectedSortOrder.value * (a.progress - b.progress);
    }
  });
});

const selectedSortOrder = ref(1);
const sortOrderOptions = [
  { label: 'Ascending', value: 1 },
  { label: 'Descending', value: -1 }
];

const fetchProgress = async () => {
  loading.value = true;
  try {
    const { data: purchases } = await api.get('/user/purchase/me');

    const { data: freePage } = await api.get('/shared/program', {
      params: { isPaid: 'false', limit: 10 }
    });
    const freePrograms = freePage.results;

    const paidPrograms = purchases.map(p => p.program);
    const allPrograms = [
      ...freePrograms,
      ...paidPrograms.filter(pp =>
        !freePrograms.some(fp => fp._id === pp._id)
      )
    ];

    const progPromises = allPrograms.map(pr =>
      api.get(`/user/program/${pr._id}/progress`)
    );
    const progResults = await Promise.all(progPromises);

    programs.value = allPrograms.map((pr, i) => ({
      ...pr,
      progress: progResults[i].data.progress
    }));
  } catch (err) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    loading.value = false;
  }
}

function viewDetail(id) {
  router.push(`/programs/details/${id}`);
}

onMounted(fetchProgress);
</script>

<style scoped>
.header {
    margin: 1rem 0;
}
.progress-tracking-page {
  display: flex;
  gap: 1rem;
  overflow-y: hidden;
}
.sort-sidebar {
   flex: 0 0 180px;
   background: var(--background-secondary);
   padding: 1rem;
   border-radius: 8px;
}
.sort-sidebar h2 {
   margin-bottom: 0.5rem;
   font-family: 'Oswald', sans-serif;
   color: var(--text-primary);
 }
 .sort-sidebar label {
   display: block;
   margin-bottom: 0.5rem;
   color: var(--text-secondary);
 }
.status {
  text-align: center;
  padding: 2rem;
}
.status.error {
  color: #f44336;
}
.empty {
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
  padding: 2rem;
}

.programs-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  overflow-y: scroll;
  scrollbar-width: none;
}
.program-card {
  background: var(--background-secondary);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}
.program-card h2 {
  font-family: 'Oswald', sans-serif;
  margin-bottom: 0.5rem;
}
.program-card .desc {
  flex: 1;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--background-main);
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--accent-primary);
  transition: width 0.4s ease;
}
.progress-label {
  font-size: 0.9rem;
  color: var(--text-primary);
  min-width: 2.5rem;
  text-align: right;
}

.program-card .button-primary {
  align-self: flex-start;
  margin-top: auto;
}
</style>
