<script setup lang="ts">
import { formatCurrency } from '@/utils/format'

interface Category {
  name: string
  icon: string
  amount: number
  color: string
}

defineProps<{
  categories: Category[]
  totalSpent: number
}>()
</script>

<template>
  <v-card rounded="lg">
    <v-card-title class="d-flex align-center gap-2 pt-4 px-4">
      <v-icon icon="mdi-chart-pie" color="primary" />
      Gastos por categoría
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col v-for="cat in categories" :key="cat.name" cols="12" sm="6" md="4">
          <div class="d-flex align-center justify-space-between mb-1">
            <div class="d-flex align-center gap-2">
              <v-icon :icon="cat.icon" :color="cat.color" size="20" />
              <span class="text-body-2">{{ cat.name }}</span>
            </div>
            <span class="text-body-2 font-weight-medium">{{ formatCurrency(cat.amount) }}</span>
          </div>
          <v-progress-linear
            :model-value="(cat.amount / totalSpent) * 100"
            :color="cat.color"
            rounded
            height="6"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
