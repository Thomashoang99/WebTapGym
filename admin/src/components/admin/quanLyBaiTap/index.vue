<template>
    <div class="col-lg-12 col-md-12">
      <div class="card">
          <section class="card-header">
              <h4>Exercises Management</h4>
          </section>
          <section class="filter-bar align-middle">
            <h5>Filters</h5>
            <div class="filter-container">
              <section>
              <span>Equipment</span>
              <select v-model="selectedEquipment" class="filter-select">
                <option value="">All</option>
                <option v-for="option in equipmentOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </section>

            <section>
              <span>Difficulty</span>
              <select v-model="selectedDifficulty" class="filter-select">
                <option value="">All</option>
                <option v-for="option in difficultyOptions" :key="option" :value="option">
                  {{ option }}
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
            <button class="btn-new" @click="createExercise">+ New...</button>      
            </div>
          </section>
          <section class="card-body">
              <div class="table-responsive">
                  <table class="table table-bordered table-hover">
                      <thead class="text-center align-middle">
                          <tr>
                            <th class="col-index"><h5>#</h5></th>
                            <th class="col-image"><h5>Image</h5></th>
                            <th class="col-name"><h5>Name</h5></th>
                            <th class="col-info"><h5>Info</h5></th>
                            <th class="col-actions"><h5>Action</h5></th>
                          </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(ex, index) in exercises" :key="ex._id" class="data-row">
                          <td class="row-index"><h6>{{ (currentPage - 1) * limit + index + 1 }}</h6></td>
                          <td class="row-image"><img :src="ex.imageUrl" /></td>
                          <td class="row-name">{{ ex.name }}</td>
                          <td class="row-info">
                              <p style="font-size: 1rem; font-weight: bold;">{{ ex.bodyParts.join(' | ') }}</p>
                              <p>{{ ex.equipment }}</p>
                              <p>{{ ex.difficulty }}</p>
                          </td>
                          <td class="row-actions">
                            <div class="btn-group">
                              <button class="btn-view" @click="viewExercise(ex._id)">View</button>
                              <button class="btn-edit" @click="editExercise(ex._id)">Edit</button>
                              <button class="btn-delete" @click="deleteExercise(ex._id)">Delete</button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                  </table>
              </div>
          </section>
          <section class="pagination">
            <button  @click="prevPage" :disabled="currentPage === 1">◄</button>
            <span> {{ currentPage }} / {{ totalPages }} </span>
            <button @click="nextPage" :disabled="currentPage === totalPages">►</button>
          </section>
      </div>

      <!--Edit modal-->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
          <ExerciseEdit
            :exerciseId="currentId"
            :readOnly="modalMode==='view'"
            @close="closeModal"
            @saved="onSaved"
          />
      </div>
    </div> 

    <div v-if="showConfirm" class="modal-overlay" @click.self="closeConfirm">
      <div class="modal-container">
          <ConfirmModal
            :message="'Are you sure you want to delete this exercise?'"
            @confirm="confirmDelete"
            @close="closeConfirm"
          />
      </div>
    </div> 
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '../../../api';

// Filter and sort options
const equipmentOptions = ['Barbell', 'Dumbbell', 'Machine', 'Bodyweight'];
const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];
const sortByOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Date Created', value: 'createdAt' }
];
const sortOrderOptions = [
  { label: 'A-Z', value: 'asc' },
  { label: 'Z-A', value: 'desc' }
];

const selectedEquipment = ref('');
const selectedDifficulty = ref('');
const selectedSortBy = ref('createdAt');
const selectedSortOrder = ref('desc');
const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(10);


const exercises = ref([]);
const loading = ref(false);
const error = ref(null);

async function fetchExercises() {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      page: currentPage.value,
      limit: limit.value,
      sortBy: selectedSortBy.value,
      sortOrder: selectedSortOrder.value
    };
    if (selectedEquipment.value)
        params.equipment = selectedEquipment.value;
    if (selectedDifficulty.value)
      params.difficulty = selectedDifficulty.value;

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

watch(
  [() => selectedDifficulty, () => selectedEquipment,
    () => selectedSortBy, () => selectedSortOrder
  ],
  () => {
    currentPage.value = 1;
    fetchExercises();
  },
  { deep: true }
);

// Watch page changes to refetch
watch(currentPage, fetchExercises);

// Pagination handlers
function prevPage() {
  if (currentPage.value > 1) currentPage.value -= 1;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
}

onMounted(fetchExercises);

//Edit modal
import ExerciseEdit from '../../modals/exerciseEdit.vue';
const showModal   = ref(false);
const modalMode   = ref('view');
const currentId   = ref(null);

function openEditModal(id, mode) {
  currentId.value = id;
  modalMode.value = mode;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}
function onSaved() {
  closeModal();
  fetchExercises(); 
}

function createExercise()  { openEditModal(null, 'edit');  }
function viewExercise(id)  { openEditModal(id, 'view'); }
function editExercise(id)  { openEditModal(id, 'edit'); }
function deleteExercise(id) {
  currentId.value = id;
  openConfirm();
}

//Confirm modal
import ConfirmModal from '../../modals/confirm.vue';
const showConfirm   = ref(false);
function openConfirm()  {  showConfirm.value = true;   }
function closeConfirm() {  showConfirm.value = false;  }
async function confirmDelete() {
  try{
    const res = await api.delete(`/admin/exercise/${currentId.value}`);
    if (res.statusText === 'OK'){
      alert('Exercise deleted');
      closeConfirm();
      fetchExercises();
    }
  } catch (err){
    alert("Failed to delete exercise");
  }
}
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
.filter-container{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 0.5rem;
  justify-content: space-between;
  flex: 1;
}
.filter-container>section{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
}

.filter-select{
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
th, td {
  border: 1px solid #ccc;
  padding: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center; vertical-align: middle;
}
.col-index {
    width: 50px;
}
.col-image {
    width: 200px;
}
.col-name {
    width: 250px;
}
.col-info{
    width: 350px;
}
.col-actions{
    width: 100px;
}
.row-index{
    font-weight: bold;
    font-size: 1.1rem;
}
.row-image>img{
    width: 100%;
    height: auto;
}
.row-name{
    font-weight: bold;
    font-size: 1.25rem;
}
.btn-group{
  display: flex;
  flex-direction: column;
  height: 100%; width: 80%;
  margin: 0 auto;
  gap: 1rem;
}
.btn-group>*{
  padding: 0.25rem 0;
}
.pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
.pagination>span{
  margin: 0 1rem;
  font-size: 1.25rem;
  font-weight: bold;
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