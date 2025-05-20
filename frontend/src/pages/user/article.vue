<template>
  <div class="articles-page">
    <aside class="filter-bar">
      <h2>Filters</h2>

      <div class="filter-group">
        <h3>Search</h3>
        <input
          id="keywords"
          v-model="filters.keywords"
          type="text"
          placeholder="Keywords…"
        />
      </div>

      <!-- Categories -->
      <div class="filter-group">
        <h3>Categories</h3>
        <div class="checkbox-list">
          <label v-for="cat in categoriesList" :key="cat">
            <input
              type="checkbox"
              :value="cat"
              v-model="filters.categories"
            />
            {{ cat }}
          </label>
        </div>
      </div>

      <!-- Tags (comma-separated) -->
      <div class="filter-group">
        <h3>Tags</h3>
        <input
          id="tags"
          v-model="filters.tagsInput"
          type="text"
        />
      </div>

      <!-- Apply / Reset -->
      <div class="filter-actions">
        <button @click="applyFilters">Apply</button>
        <button class="reset" @click="resetFilters">Reset</button>
      </div>
    </aside>

    <!-- Main Content -->
    <section class="results-section">
      <!-- Sorting Controls -->
      <div class="sort-bar">
        <label>
          Sort by
          <select v-model="sorting.sortBy">
            <option value="title">Title</option>
            <option value="createdAt">Date</option>
          </select>
        </label>
        <label>
          Order
          <select v-model="sorting.sortOrder">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      <!-- Articles Grid -->
      <div class="articles-grid">
        <div v-for="art in articles" :key="art._id" class="article-card">
          <img v-if="art.imageUrl" :src="art.imageUrl" alt="" />
          <section>
            <p>{{ formatDate(art.createdAt) }}</p>
            <h3>{{ art.title }}</h3>
            <p class="summary">{{ art.summary }}</p>
            <router-link class="button-primary read-more" :to="`/articles/details/${art._id}`">Read More</router-link>
          </section>

        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button :disabled="page === 1" @click="changePage(page - 1)">
          Prev
        </button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button :disabled="page === totalPages" @click="changePage(page + 1)">
          Next
        </button>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="status">Loading…</div>
      <div v-if="error" class="status error">{{ error }}</div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import api from '../../api';
import { formatDate } from '../../utils/helper';

const categoriesList = ['Nutrition', 'Training', 'Recovery'];

const filters = reactive({
  keywords: '',
  categories: [],
  tagsInput: ''
});

const sorting = reactive({
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

const page = ref(1);
const limit = 10;

const articles = ref([]);
const totalPages = ref(1);
const loading = ref(false);
const error = ref(null);

const fetchArticles = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      page: page.value,
      limit,
      sortBy: sorting.sortBy,
      sortOrder: sorting.sortOrder
    };
    if (filters.keywords) {    
        params.keywords    = filters.keywords;
    }
    if (filters.categories.length) {
      params.categories = filters.categories.join(',');
    }
    if (filters.tagsInput) {
      params.tags = filters.tagsInput
        .split(' ').map(t => t.trim()).filter(Boolean).join(',');
    }

    const res = await api.get('/shared/article', { params });
    articles.value   = res.data.results;
    totalPages.value = res.data.totalPages;
  } catch (err) {
    error.value = err.response?.data || err.message;
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  page.value = 1;
  fetchArticles();
};
const resetFilters = () => {
  filters.keywords = '';
  filters.categories = [];
  filters.tagsInput = '';
  page.value = 1;
  fetchArticles();
};

const changePage = p => {
  page.value = p;
  fetchArticles();
};

// refetch on sort change
watch(
  () => [sorting.sortBy, sorting.sortOrder],
  () => {
    page.value = 1;
    fetchArticles();
  }
);

onMounted(fetchArticles);
</script>

<style scoped>
.articles-page {
  display: flex;
  gap: 1rem;
}

/* Sidebar */
.filter-bar {
  flex: 0 0 220px;
  background: var(--background-secondary);
  padding: 1rem;
  border-radius: 8px;
}
.filter-bar h2 {
  margin-bottom: 0.5rem;
}
.filter-group {
  margin-bottom: 1rem;
}
.filter-group label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.25rem;
}
.checkbox-list label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}
.filter-actions {
  display: flex;
  gap: 0.5rem;
}
.filter-actions button {
  flex: 1;
  padding: 0.5rem;
}
.filter-actions .reset {
  background: transparent;
  border: 1px solid #ccc;
}

/* Main */
.results-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Sort bar */
.sort-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.sort-bar label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Grid */
.articles-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
.article-card {
  background: var(--background-secondary);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  height: 250px;
}
.article-card img {
  width: 20%;
  height: auto;
  vertical-align: middle;
  border-radius: 4px;
  
}
.article-card section {
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.article-card section h3 {
  margin: 0;
  font-size: 1.2rem;
}
.article-card section .summary {
  flex: 1;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.read-more {
  flex: 0;
  width: auto;
}


/* Pagination */
.pagination {
  display: flex;
  gap: 1rem;
  align-self: center;
  margin: 1rem 0;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Status */
.status {
  text-align: center;
  padding: 1rem;
}
.status.error {
  color: #f44336;
}

/* Hover lift & shadow on cards */
.article-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .articles-page {
    flex-direction: column;
  }
  .filter-bar {
    flex: 1 1 auto;
    margin-bottom: 1rem;
  }
  .articles-grid {
    padding: 0 0.5rem;
  }
}

</style>
