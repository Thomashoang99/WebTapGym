<template>
  <div class="col-lg-12 col-md-12">
    <div class="card">
      <section class="card-header">
        <h4>User Management</h4>
      </section>

      <section class="filter-bar align-middle">
        <h5>Filters:</h5>
        <div class="filter-container">
          <div>
            <span>Username</span>
            <input
              v-model="filters.username"
              placeholder="Filter by username"
              class="filter-input"
            />
          </div>
          <div>
            <span>Email</span>
            <input
              v-model="filters.email"
              placeholder="Filter by email"
              class="filter-input"
            />
          </div>
          <div>
            <span>From </span>
            <input
              type="date"
              v-model="filters.createdFrom"
              class="filter-input"
            />
            <span> to </span>
            <input
              type="date"
              v-model="filters.createdTo"
              class="filter-input"
            />
          </div>
          <div class="btn-group">
            <button class="btn-view" @click="fetchUsers(1)">Filter</button>
            <button class="btn-delete" @click="defaultFetch">Clear</button>
          </div>
        </div>
      </section>

      <section class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="text-center align-middle">
              <tr>
                <th class="col-index"><h5>#</h5></th>
                <th class="col-name"><h5>Username</h5></th>
                <th class="col-email"><h5>Email</h5></th>
                <th class="col-date"><h5>Created On</h5></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(u, idx) in users" :key="u._id" class="data-row">
                <td class="row-index">
                  <h6>{{ (page - 1) * limit + idx + 1 }}</h6>
                </td>
                <td class="row-name">
                  <h6>{{ u.username }}</h6>
                </td>
                <td class="row-email">
                  {{ u.email }}
                </td>
                <td class="row-date">
                  {{ formatDate(u.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="pagination">
        <button @click="prevPage" :disabled="page === 1">◄</button>
        <span> {{ page }} / {{ totalPages }} </span>
        <button @click="nextPage" :disabled="page === totalPages">►</button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import api from "../../../api";
import { formatDate } from "../../../utils/helper";

const page = ref(1);
const limit = ref(10);
const totalPages = ref(1);
const users = ref([]);

const filters = reactive({
  username: "",
  email: "",
  createdFrom: "",
  createdTo: "",
});

async function fetchUsers(pageToFetch = 1) {
  const params = {
    page: pageToFetch,
    limit: limit.value,
    ...filters,
  };
  const { data } = await api.get("/admin/usermgmt", { params });
  users.value = data.results;
  totalPages.value = data.totalPages;
}

async function defaultFetch() {
  resetFilters();
  fetchUsers(1);
}

function resetFilters() {
  filters.username = "";
  filters.email = "";
  filters.createdFrom = "";
  filters.createdTo = "";
}

function prevPage() {
  if (page.value > 1) page.value--;
}
function nextPage() {
  if (page.value < totalPages.value) page.value++;
}

watch([page], () => {
  fetchUsers(page.value);
});

onMounted(() => {
  fetchUsers(1);
});
</script>

<style scoped>
.filter-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0 1rem;
  width: 100%;
}
.filter-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex: 1;
}
.filter-container > * {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
}
.filter-input {
  padding: 0.25rem;
}
.btn-group>button{
  padding: 0.25rem 0.75rem;
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
  white-space: nowrap;
}
.pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
.pagination > span {
  margin: 0 1rem;
  font-size: 1.25rem;
  font-weight: bold;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-container {
  background: var(--background-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
