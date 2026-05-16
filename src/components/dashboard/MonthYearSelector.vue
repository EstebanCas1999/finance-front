<script setup lang="ts">
const MONTHS = [
  { title: 'Enero', value: 1 },
  { title: 'Febrero', value: 2 },
  { title: 'Marzo', value: 3 },
  { title: 'Abril', value: 4 },
  { title: 'Mayo', value: 5 },
  { title: 'Junio', value: 6 },
  { title: 'Julio', value: 7 },
  { title: 'Agosto', value: 8 },
  { title: 'Septiembre', value: 9 },
  { title: 'Octubre', value: 10 },
  { title: 'Noviembre', value: 11 },
  { title: 'Diciembre', value: 12 },
]

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

defineProps<{ month: number; year: number }>()

const emit = defineEmits<{
  'update:month': [number]
  'update:year': [number]
}>()
</script>

<template>
  <div class="d-flex align-center gap-2">
    <v-select
      :model-value="month"
      :items="MONTHS"
      item-title="title"
      item-value="value"
      variant="outlined"
      density="compact"
      hide-details
      style="width: 140px"
      @update:model-value="emit('update:month', $event)"
    />
    <v-select
      :model-value="year"
      :items="YEARS"
      variant="outlined"
      density="compact"
      hide-details
      style="width: 100px"
      @update:model-value="emit('update:year', $event)"
    />
  </div>
</template>
