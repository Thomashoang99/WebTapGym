<template>
  <div class="metrics-page">
    <h1>My Body Tracker</h1>
    <button class="button-primary" @click="openModal()">+ New Entry</button>

    <!-- Chart -->
    <div class="chart-container">
      <LineChart :entries="entries" />
    </div>

    <!-- Table -->
    <table class="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Weight &#40;kg&#41;</th>
          <th>Body fat &#40;%&#41;</th>
          <th class="col-actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in entries" :key="e._id">
          <td>{{ formatDate(e.date) }}</td>
          <td>{{ e.weight }}</td>
          <td>{{ e.bodyFat }}</td>
          <td class="row-actions">
            <button class="data-btn btn-edit" @click="openModal(e)">Edit</button>
            <button class="data-btn btn-delete" @click="remove(e._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <MetricModal
      v-if="showModal"
      :entry="currentEntry"
      @saved="reload"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../api";
import MetricModal from "../../components/metric-modal.vue";
import LineChart from "../../components/health-chart.vue";
import { formatDate } from "../../utils/helper";

const entries = ref([]);
const showModal = ref(false);
const currentEntry = ref(null);


async function reload() {
  const { data } = await api.get("/user/metric");
  entries.value = data;
}

function openModal(entry = null) {
  currentEntry.value = entry;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

async function remove(id) {
  if (!confirm("Delete this entry?")) return;
  await api.delete(`/user/metric/${id}`);
  reload();
}

onMounted(reload);
</script>

<style scoped>
.metrics-page {
  max-width: 60vw;
  margin: 0.5rem auto;
  color: var(--text-primary);
}
h1 {
  margin-top: 0.5rem;
}
.chart-container {
  width: 104%;
  position: sticky;
  top: 1vh;
  background-color: var(--background-main);
  margin-top: 1rem;
  justify-self: center;
  height: 50vh;
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: calc(1rem + ((1vw - 0.48rem) * 0.3472));
  background-color: var(--background-main);
}
thead {
  position: sticky;
  top: calc(51vh - 0.5rem);
  background-color: var(--background-main);
}
th,
td {
  padding: 0.5rem;
  border: 1px solid #444;
  text-align: center;
}
.button-primary {
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
}
.col-actions{
  width: 20%;
}
.row-actions{
  justify-content: center;
  display: flex;
  gap: 0.5rem;
}
.data-btn{
  font-size: 1rem;
  padding: 0.25rem 0.75rem;
}
.btn-edit {
  background-color: #f1c40f;
  color: #000;
  border-radius: 4px;
}

.btn-delete {
  background-color: #e74c3c;
  color: #fff;
  border-radius: 4px;
}
@media (max-width: 768px) {
  .metrics-page {
    max-width: 80vw;
  }
  .chart-container {
    height: 60vh;
    position: static;
  }
  .table{
    font-size: 1rem;
  }
  thead>tr {
  position: static;
}
}
</style>
