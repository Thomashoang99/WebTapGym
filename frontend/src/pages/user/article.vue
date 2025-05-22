<template>
  <div class="articles-page">
    <aside class="filter-bar">
      <h2>Filters</h2>

      <div class="filter-group">
        <h3>Search</h3>
        <input
          class="filter-input"
          v-model="filters.keywords"
          type="text"
          placeholder="Keywords…"
        />
      </div>

      <!-- Categories -->
      <div class="filter-group">
        <h3>Categories</h3>
        <select class="filter-select" v-model="filters.categories">
          <option v-for="cat in categoriesList" :key="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <h3>Tags</h3>
        <input class="filter-input" v-model="filters.tagsInput" type="text" />
      </div>

      <div class="filter-group date">
        <h3>Date Created</h3>
        <input class="filter-input" v-model="filters.createdFrom" type="date" />
        <input class="filter-input" v-model="filters.createdTo" type="date" />
      </div>

      <!-- Apply / Reset -->
      <div class="filter-actions">
        <button class="button-primary" @click="applyFilters">Apply</button>
        <button class="button-secondary" @click="resetFilters">Reset</button>
      </div>
    </aside>

    <!-- Main Content -->
    <section class="results-section">
      <div class="sort-bar">
        <label>
          Sort by
          <select v-model="filters.sortBy">
            <option value="title">Title</option>
            <option value="createdAt">Date</option>
          </select>
        </label>
        <label>
          Order
          <select v-model="filters.sortOrder">
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
            <router-link
              class="button-primary read-more"
              :to="`/articles/details/${art._id}`"
              >Read More</router-link
            >
          </section>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button  @click="prevPage" :disabled="page === 1">
          ◄
        </button>
        <span> {{ page }} / {{ totalPages }} </span>
        <button @click="nextPage" :disabled="page === totalPages">
          ►
        </button>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="status">Loading…</div>
      <div v-if="error" class="status error">{{ error }}</div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import api from "../../api";
import { formatDate } from "../../utils/helper";

const categoriesList = ["Nutrition", "Training", "Recovery"];

const filters = reactive({
  keywords: "",
  categories: "",
  tagsInput: "",
  createdFrom: "",
  createdTo: "",
  sortBy: "createdAt",
  sortOrder: "desc",
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
      ...filters,
    };
    if (filters.keywords) {
      params.keywords = filters.keywords;
    }
    if (filters.categories) {
      params.categories = filters.categories;
    }
    if (filters.tagsInput) {
      params.tags = filters.tagsInput
        .split(" ")
        .map((t) => t.trim())
        .filter(Boolean)
        .join(",");
    }

    const res = await api.get("/shared/article", { params });
    articles.value = res.data.results;
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
  filters.keywords = "";
  filters.categories = [];
  filters.tagsInput = "";
  page.value = 1;
  fetchArticles();
};

const changePage = (p) => {
  page.value = p;
  fetchArticles();
};

// refetch on sort change
watch(
  () => [filters.sortBy, filters.sortOrder],
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
  flex: 1;
  background: var(--background-secondary);
  padding: 0.5rem;
  border-radius: 8px;
}
.filter-bar h2 {
  margin-bottom: 0.5rem;
}
.filter-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 0.25rem 0;
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
  flex: 5;
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

.article-card section .read-more {
  padding: 0.5rem;
  text-align: center;
  width: 30%;
}

/* Pagination */
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

.status {
  text-align: center;
  padding: 1rem;
}
.status.error {
  color: #f44336;
}

.article-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .filter-bar{
    flex: 0 0 125px;
  }
  .articles-grid {
    padding: 0 0.5rem;
  }
  .article-card{
    height: auto;
    padding: 0.5rem;
  }
  .article-card img{
    width: 30%;
  }
  .article-card section .read-more{
    padding: 0.25rem;
  }
}
</style>
