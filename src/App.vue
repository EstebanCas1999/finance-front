<script setup lang="ts">
import { onMounted } from 'vue'
import { useReminders } from '@/composables/useReminders'

const { checkDueReminders } = useReminders()

onMounted(() => checkDueReminders())
</script>

<template>
  <RouterView />
</template>
