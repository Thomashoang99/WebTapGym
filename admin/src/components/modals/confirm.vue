<template>
    <div class="confirm-modal">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="modal-buttons">
        <button class="modal-button button-secondary" @click="emitClose">
          {{ rejectText }}
        </button>
        <button class="modal-button button-primary" @click="emitConfirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: 'Confirm' },
  message: { type: String, default: 'Confirm to proceed?' },
  confirmText: { type: String, default: 'Yes' },
  rejectText: { type: String, default: 'No'}
})

const emit = defineEmits(['confirm', 'close'])

function emitConfirm() {
  emit('confirm')
}
function emitClose() {
  emit('close')
}
</script>

<style scoped>
.confirm-modal {
  max-width: 50vw;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  color: var(--text-primary);
}

.modal-buttons {
  width: 100%;
  display: flex;
  gap: 1rem;
}

.modal-button {
  flex: 1;
  padding: 0.5rem 4rem;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
</style>
