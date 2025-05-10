<template>
  <div class="filter-bar">

  </div>
</template>

<script setup>
import { reactive, watch, toRefs } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  category: String,
  options: Object
})

const emit = defineEmits(['update:filters'])

const selectedFilters = reactive({})

// Initialize with empty strings
for (const key in props.options) {
  selectedFilters[key] = ''
}

const emitFilters = () => {
  emit('update:filters', { ...selectedFilters })
}
</script>

<style>

</style>