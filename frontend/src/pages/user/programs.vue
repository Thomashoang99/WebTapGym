<template>
  <div class="programs-page">
    <aside class="filter-bar">
      <h2>Filters</h2>

      <div class="filter-group">
        <h3>Search</h3>
        <input class="filter-select"
          id="keywords"
          v-model="filters.keywords"
          type="text"
          placeholder="Program name…"
        />
      </div>

      <div class="filter-group">
        <h3>Difficulty</h3>
        <select
          id="difficulty"
          v-model="filters.difficulty"
          class="filter-select"
        >
          <option value="">All</option>
          <option v-for="d in difficulties" :key="d" :value="d">
            {{ d }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <h3>
          Max Duration: {{ filters.durationMax }} wk<span
            v-if="filters.durationMax > 1"
            >s</span
          >
        </h3>
        <input
          id="durationMax"
          type="range"
          :min="1"
          :max="16"
          v-model.number="filters.durationMax"
        />
      </div>

      <div class="filter-group">
        <h3>Price</h3>
        <select id="priceFilter" v-model="filters.isPaid" class="filter-select">
          <option value="">All</option>
          <option value="false">Free</option>
          <option value="true">Paid</option>
        </select>
      </div>

      <div class="filter-group">
        <h3>Sort by</h3>
        <select class="filter-select" v-model="sorting.sortBy">
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </div>

      <div class="filter-group">
        <h3>Order</h3>
        <select class="filter-select" v-model="sorting.sortOrder">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div class="filter-actions">
        <button class="button-primary" @click="applyFilters">Apply</button>
        <button class="button-secondary" @click="resetFilters">Reset</button>
      </div>
    </aside>

    <section class="results-section">
      <div v-if="!authStore.isLoggedIn" class="guest-prompt">
        <button @click="router.push('/login')">
          Log in to see paid programs
        </button>
      </div>

      <div class="programs-grid">
        <div
          v-for="prog in programs"
          :key="prog._id"
          class="program-card"
          :class="{ buy: prog.isPaid && !prog.purchased }"
        >
          <h3>{{ prog.name }}</h3>
          <p class="duration">
            {{ prog.duration }} wk<span v-if="prog.duration > 1">s</span>
          </p>
          <p class="difficulty">{{ prog.difficulty }}</p>
          <button
            v-if="!prog.isPaid || prog.purchased"
            @click="viewDetails(prog._id)"
            class="button-primary"
          >
            View Details
          </button>
          <button
            v-else
            class="buy button-primary"
            @click="buyProgram(prog._id)"
          >
            Buy Now! {{ formatNumber(prog.price) }}đ
          </button>
        </div>
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="page === 1">◄</button>
        <span> {{ page }} / {{ totalPages }} </span>
        <button @click="nextPage" :disabled="page === totalPages">►</button>
      </div>

      <div v-if="loading" class="status">Loading…</div>
      <div v-if="error" class="status error">{{ error }}</div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "../../stores/cartStore";
import api from "../../api";
import { formatNumber } from "../../utils/helper";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const cartStore = useCartStore();

const difficulties = ["Beginner", "Intermediate", "Advanced"];

const filters = reactive({
  keywords: "",
  difficulty: "",
  durationMax: 16,
  isPaid: "",
});

const sorting = reactive({
  sortBy: "name",
  sortOrder: "asc",
});

const page = ref(1);
const limit = 10;

const programs = ref([]);
const totalPages = ref(1);
const loading = ref(false);
const error = ref(null);

const fetchPrograms = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      page: page.value,
      limit,
      sortBy: sorting.sortBy,
      sortOrder: sorting.sortOrder,
      keywords: filters.keywords || undefined,
      difficulty: filters.difficulty || undefined,
      durationMax: filters.durationMax || undefined,
      isPaid: filters.isPaid !== "" ? filters.isPaid : undefined,
    };

    const res = await api.get("/shared/program", { params });
    let list = res.data.results;

    if (!authStore.isLoggedIn) {
      list = list.filter((p) => !p.isPaid);
    }

    programs.value = list;
    totalPages.value = res.data.totalPages;
  } catch (err) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  page.value = 1;
  fetchPrograms();
};
const resetFilters = () => {
  filters.keywords = "";
  filters.difficulty = "";
  filters.durationMax = 16;
  filters.isPaid = "";
  page.value = 1;
  fetchPrograms();
};

const changePage = (p) => {
  page.value = p;
  fetchPrograms();
};

const viewDetails = (id) => {
  router.push(`/programs/details/${id}`);
};
const buyProgram = (id) => {
  const program = programs.value.find((p) => p._id === id);
  if (program) {
    cartStore.addToCart(program);
  }
};

watch(
  () => [sorting.sortBy, sorting.sortOrder],
  () => {
    page.value = 1;
    fetchPrograms();
  }
);

watch(route.query.payment, (paymentStatus) => {});
onMounted(() => {
  fetchPrograms();
  const { payment } = route.query;
  if (payment === "success") {
    cartStore.clearCart();
    alert("Purchase successful!");
  } else if (payment === "failed") {
    alert("Purchase failed!");
  }
});
</script>

<style scoped>
.programs-page {
  display: flex;
  gap: 1rem;
  min-height: 100%;
}

/* Sidebar */
.filter-bar {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);
  height: 100vh;
  background: var(--background-secondary);
  border-radius: 8px;
}
.filter-bar h2 {
  margin-bottom: 0.5rem;
}
.filter-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.filter-group label {
  margin-bottom: 0.25rem;
  font-weight: bold;
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

/* Main section */
.results-section {
  flex: 5;
  display: flex;
  flex-direction: column;
}

/* Guest prompt */
.guest-prompt {
  padding: 1rem;
  text-align: center;
}
.guest-prompt button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
.guest-prompt button:hover {
  background-color: #0056b3;
}

/* Sorting bar */
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
.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  padding-top: 1rem;
}
.program-card {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.program-card h3 {
  margin: 0;
}
.program-card .duration,
.program-card .difficulty,
.program-card .price {
  font-size: 0.9rem;
  margin: 0;
}
.program-card button {
  margin-top: auto;
  padding: 0.5rem;
  cursor: pointer;
}
.buy {
  border: 2px solid orange;
}

.program-card.buy {
  scale: 1.02;
}

button.buy {
  text-transform: uppercase;
}

/* Pagination */
.pagination {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 1rem 0;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Status messages */
.status {
  text-align: center;
  padding: 1rem;
}
.status.error {
  color: red;
}
</style>
