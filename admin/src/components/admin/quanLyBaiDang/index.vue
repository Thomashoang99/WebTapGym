<template>
  <div class="col-lg-12 col-md-12">
    <div class="card">
      <section class="card-header">
        <h4>Article Management</h4>
      </section>
      <section class="filter-bar align-middle">
        <h5>Filters</h5>
        <div class="filter-container">
          <section>
            <span>Category</span>
            <select v-model="selectedCategory" class="filter-select">
              <option value="">All</option>
              <option
                v-for="option in categoryOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </section>

          <section>
            <span>From </span>
            <input
              type="date"
              v-model="selectedDateFrom"
              class="filter-input"
            />
            <span> to </span>
            <input
              type="date"
              v-model="selectedDateTo"
              class="filter-input"
            />
          </section>

          <section>
            <span>Sort By</span>
            <select v-model="selectedSortBy" class="filter-select">
              <option
                v-for="opt in sortByOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </section>

          <section>
            <span>Order</span>
            <select v-model="selectedSortOrder" class="filter-select">
              <option
                v-for="opt in sortOrderOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </section>
          <button class="btn-new" @click="createArticle">+ New...</button>
        </div>
      </section>
      <section class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="text-center align-middle">
              <tr>
                <th class="col-index"><h5>#</h5></th>
                <th class="col-image"><h5>Image</h5></th>
                <th class="col-title"><h5>Title</h5></th>
                <th class="col-date"><h5>Date</h5></th>
                <th class="col-tags"><h5>Tags</h5></th>
                <th class="col-summary"><h5>Summary</h5></th>
                <th class="col-actions"><h5>Actions</h5></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(art, index) in articles"
                :key="art._id"
                class="data-row"
              >
                <td class="row-index">
                  <h6>{{ (currentPage - 1) * pageSize + index + 1 }}</h6>
                </td>
                <td class="row-image"><img :src="art.imageUrl" /></td>
                <td class="row-title">{{ art.title }}</td>
                <td class="row-date">{{ formatDate(art.createdAt) }}</td>
                <td class="row-tags">{{ art.tags.join(", ") }}</td>
                <td class="row-summary">{{ art.summary }}</td>
                <td class="row-actions">
                  <div class="btn-group">
                    <button class="btn-view" @click="viewArticle(art._id)">
                      View
                    </button>
                    <button class="btn-edit" @click="editArticle(art._id)">
                      Edit
                    </button>
                    <button class="btn-delete" @click="deleteArticle(art._id)">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">◄</button>
        <span> {{ currentPage }} / {{ totalPages }} </span>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          ►
        </button>
      </section>
    </div>
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <ArticleEdit
          :articleId="currentId"
          :readOnly="modalMode === 'view'"
          @close="closeModal"
          @saved="onSaved"
        />
      </div>
    </div>

    <div v-if="showConfirm" class="modal-overlay" @click.self="closeConfirm">
      <div class="modal-container">
        <ConfirmModal
          :message="'Are you sure you want to delete this article?'"
          @confirm="confirmDelete"
          @close="closeConfirm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../../../api";
import { formatDate } from "../../../utils/helper";
// Filter and sort options
const categoryOptions = ["Nutrition", "Training", "Recovery"];
const sortByOptions = [
  { label: "Title", value: "title" },
  { label: "Date Created", value: "createdAt" },
];
const sortOrderOptions = [
  { label: "A-Z", value: "asc" },
  { label: "Z-A", value: "desc" },
];

// Reactive state
const selectedCategory = ref("");
const selectedSortBy = ref("createdAt");
const selectedSortOrder = ref("desc");
const selectedDateFrom = ref("");
const selectedDateTo = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);

const articles = ref([]);
const loading = ref(false);
const error = ref(null);

async function fetchArticles() {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      category: selectedCategory.value,
      limit: pageSize.value,
      createdFrom: selectedDateFrom.value,
      createdTo: selectedDateTo.value,
      sortBy: selectedSortBy.value,
      sortOrder: selectedSortOrder.value,
    };

    const { data } = await api.get("/shared/article", { params });
    articles.value = data.results;
    totalPages.value = data.totalPages;
  } catch (err) {
    error.value = "Failed to load articles.";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

watch([selectedCategory, selectedSortBy, selectedSortOrder, selectedDateFrom, selectedDateTo], () => {
  currentPage.value = 1;
  fetchArticles();
});
watch(currentPage, fetchArticles);
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

onMounted(fetchArticles);

import ArticleEdit from "../../modals/articleEdit.vue";
const showModal = ref(false);
const modalMode = ref("view");
const currentId = ref(null);

function openModal(id, mode) {
  currentId.value = id;
  modalMode.value = mode;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}
function onSaved() {
  closeModal();
  fetchArticles();
}

function createArticle() {
  openModal(null, "edit");
}
function viewArticle(id) {
  openModal(id, "view");
}
function editArticle(id) {
  openModal(id, "edit");
}
async function deleteArticle(id) {
  currentId.value = id;
  openConfirm();
}

//Confirm modal
import ConfirmModal from "../../modals/confirm.vue";
const showConfirm = ref(false);
function openConfirm() {
  showConfirm.value = true;
}
function closeConfirm() {
  showConfirm.value = false;
}
async function confirmDelete() {
  try {
    const res = await api.delete(`/admin/article/${currentId.value}`);
    if (res.statusText === "OK") {
      alert("Aricle deleted");
      closeConfirm();
      fetchArticles();
    }
  } catch (err) {
    alert("Failed to delete this article");
  }
}
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
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 0.5rem;
  justify-content: space-between;
  flex: 1;
}
.filter-container > section {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
}

.filter-input, .filter-select {
  height: 1.5rem;
  padding-right: 1rem;
}
.btn-new {
  padding: 0.25rem 0.75rem;
  background-color: green;
  color: var(--text-primary);
  border-radius: 4px;
}
table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  vertical-align: middle;
}
.col-index {
  width: 50px;
}
.col-image {
  width: 200px;
}
.col-title {
  width: 200px;
}
.col-summary {
  width: 350px;
}
.col-actions {
  width: 100px;
}
.row-index {
  font-weight: bold;
  font-size: 1.1rem;
}
.row-image > img {
  width: 100%;
  height: auto;
}
.row-title {
  font-weight: bold;
  font-size: 1.25rem;
}
.row-summary, .row-tags, .row-date, .row-title {
  text-wrap: wrap;
}
.btn-group {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 80%;
  margin: 0 auto;
  gap: 1rem;
}
.btn-group > * {
  padding: 0.25rem 0;
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
