<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <h3>{{ entry ? 'Edit ' : 'New ' }} Entry</h3>
      <form @submit.prevent="save">
        <div class="field">
          <label>Date</label>
          <input type="date" v-model="form.date" required />
        </div>
        <div class="field">
          <label>Weight (kg)</label>
          <input type="number" v-model.number="form.weight" step="0.1" required />
        </div>
        <div class="field">
          <label>Body-Fat %</label>
          <input type="number" v-model.number="form.bodyFat" step="0.1" required />
        </div>
        <button class="button-primary" type="submit">{{ saving ? 'Saving…' : 'Save' }}</button>
        <button class="button-secondary" type="button" @click="close">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue';
import api from '../api';

const props = defineProps({
  entry: { type: Object, default: null }  // existing entry or null
});
const emit = defineEmits(['saved', 'close']);

const form = reactive({
  date: '',
  weight: null,
  bodyFat: null
});
const saving = ref(false);

onMounted(() => {
  if (props.entry) {
    form.date    = props.entry.date.slice(0,10);
    form.weight  = props.entry.weight;
    form.bodyFat = props.entry.bodyFat;
  } else {
    form.date = new Date().toISOString().slice(0,10);
  }
});

async function save() {
  saving.value = true;
  console.log(form);
  try {
    if (props.entry) {
      await api.put(`/user/metric/${props.entry._id}`, form);
    } else {
      await api.post('/user/metric', form);
    }
    emit('saved');
    close();
  } catch (err) {
    alert(err.response?.data?.error || err.message);
  } finally {
    saving.value = false;
  }
}

function close() {
  emit('close');
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
}
.modal-container {
  background: var(--background-secondary);
  padding: 1.5rem; border-radius: 8px; width: 300px;
}
.field { margin-bottom: 1rem; }
.field label { display: block; margin-bottom: 0.25rem; }
.field input { width: 100%; padding: 0.5rem; border-radius: 4px; border:1px solid #333; }
</style>
