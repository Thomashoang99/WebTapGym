<template>
  <div class="col-lg-12 col-md-12">
    <div class="card">
      <section class="card-header">
        <h4>Programs Management</h4>
      </section>

      <section class="filter-bar align-middle">
        <h5>Filters</h5>
        <div class="filter-container">
          <section>
            <span>Difficulty</span>
            <select v-model="selectedDifficulty" class="filter-select">
              <option value="">All</option>
              <option v-for="opt in difficultyOptions" :key="opt" :value="opt">
                {{ opt }}
              </option>
            </select>
          </section>

          <section>
            <span>Min Dur</span>
            <input type="number" min="1" :max="selectedDurMax" v-model="selectedDurMin" class="filter-select" />
          </section>

          <section>
            <span>Max Dur</span>
            <input type="number" :min="selectedDurMin" max="16" v-model="selectedDurMax" class="filter-select" />
          </section>

          <section>
            <span>Paid Status</span>
            <select v-model="selectedPaid" class="filter-select">
              <option value="">All</option>
              <option v-for="opt in paidOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </section>

          <section>
            <span>Sort By</span>
            <select v-model="selectedSortBy" class="filter-select">
              <option v-for="opt in sortByOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </section>

          <section>
            <span>Order</span>
            <select v-model="selectedSortOrder" class="filter-select">
              <option v-for="opt in sortOrderOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </section>

          <button class="btn-new" @click="openModal(null, 'edit')">+ New...</button>
        </div>
      </section>

      <section class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="text-center align-middle">
              <tr>
                <th class="col-index"><h5>#</h5></th>
                <th class="col-name"><h5>Name</h5></th>
                <th class="col-info"><h5>Details</h5></th>
                <th class="col-actions"><h5>Action</h5></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(prog, idx) in programs" :key="prog._id" class="data-row">
                <td class="row-index"><h6>{{ (currentPage - 1) * limit + idx + 1 }}</h6></td>
                <td class="row-name"><h6>{{ prog.name }}</h6></td>
                <td class="row-info">
                  <p style="font-weight: bold;">{{ prog.difficulty }}</p>
                  <p>{{ prog.duration }} week(s)</p>
                  <p v-if="prog.isPaid">Price: {{ formatNumber(prog.price) }}đ</p>
                  <p v-else>Free</p>
                </td>
                <td class="row-actions">
                  <div class="btn-group">
                    <button class="btn-view" @click="openModal(prog._id, 'view')">View</button>
                    <button class="btn-edit" @click="openModal(prog._id, 'edit')">Edit</button>
                    <button class="btn-delete" @click="promptDelete(prog._id)">Delete</button>
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
        <button @click="nextPage" :disabled="currentPage === totalPages">►</button>
      </section>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <ProgramForm
          :programId="currentId"
          :readOnly="modalMode === 'view'"
          @close="closeModal"
          @saved="handleSaved"
        />
      </div>
    </div>

    <div v-if="showConfirm" class="modal-overlay" @click.self="closeConfirm">
      <div class="modal-container">
        <ConfirmModal
          message="Are you sure you want to delete this program?"
          @confirm="confirmDelete"
          @close="closeConfirm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../../../api'
import ProgramForm from '../../modals/programEdit.vue'
import ConfirmModal from '../../modals/confirm.vue'
import { formatNumber } from '../../../utils/helper.js';
const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced']
const paidOptions = [
  { label: 'Paid', value: true },
  { label: 'Free', value: false }
]
const sortByOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Date Created', value: 'createdAt' }
]
const sortOrderOptions = [
  { label: 'A-Z', value: 'asc' },
  { label: 'Z-A', value: 'desc' }
]

const selectedDifficulty = ref('')
const selectedPaid = ref('')
const selectedSortBy = ref('createdAt')
const selectedSortOrder = ref('desc')
const selectedDurMin = ref(1)
const selectedDurMax = ref(16)
const currentPage = ref(1)
const totalPages = ref(1)
const limit = ref(10)

const programs = ref([])
const loading = ref(false)
const error = ref(null)

const showModal = ref(false)
const modalMode = ref('view')
const currentId = ref(null)

const showConfirm = ref(false)

async function fetchPrograms() {
  loading.value = true
  error.value = null

  try {
    const params = {
      page: currentPage.value,
      limit: limit.value,
      sortBy: selectedSortBy.value,
      sortOrder: selectedSortOrder.value,
      durationMin: selectedDurMin.value,
      durationMax: selectedDurMax.value
    }
    if (selectedDifficulty.value) params.difficulty = selectedDifficulty.value
    if (selectedPaid.value !== '') params.isPaid = selectedPaid.value

    const { data } = await api.get('/shared/program', { params })
    programs.value = data.results
    totalPages.value = data.totalPages
  } catch (err) {
    error.value = 'Failed to load programs.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function openModal(id, mode) {
  currentId.value = id
  modalMode.value = mode
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}
function handleSaved() {
  closeModal()
  fetchPrograms()
}

function promptDelete(id) {
  currentId.value = id
  showConfirm.value = true
}
function closeConfirm() {
  showConfirm.value = false
}
async function confirmDelete() {
  try {
    await api.delete(`/admin/program/${currentId.value}`)
    closeConfirm()
    fetchPrograms()
  } catch {
    alert('Failed to delete program.')
  }
}

watch([
  selectedDifficulty,
  selectedPaid,
  selectedSortBy,
  selectedSortOrder,
  selectedDurMin,
  selectedDurMax
], () => {
  currentPage.value = 1
  fetchPrograms()
})
watch(currentPage, fetchPrograms)

onMounted(fetchPrograms)
</script>

<style scoped>
.filter-bar {
  display: flex;
  flex-direction: row; align-items: center;
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
.filter-container>section{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
}
.filter-select {
  padding: 0.25rem;
}
.btn-new {
  background-color: green;
  color: var(--text-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
  white-space: nowrap;
}
.btn-group{
  display: flex;
  flex-direction: column;
  height: 100%; width: 80%;
  margin: 0 auto;
  gap: 1rem;
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  gap: 1rem;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
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
