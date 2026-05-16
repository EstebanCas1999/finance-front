<script setup lang="ts">
import { ref } from 'vue'
import { formatCurrency } from '@/utils/format'

interface Category {
  name: string
}

const props = defineProps<{
  totalIncome: number
  totalSpent: number
  totalSaved: number
  balance: number
  categories: Category[]
}>()

const emit = defineEmits<{
  addTransaction: [{ type: 'income' | 'expense'; amount: number; category: string }]
}>()

const dialog = ref(false)
const form = ref({ type: 'expense' as 'income' | 'expense', description: '', amount: 0, category: '' })

const submit = () => {
  emit('addTransaction', { type: form.value.type, amount: Number(form.value.amount), category: form.value.category })
  dialog.value = false
  form.value = { type: 'expense', description: '', amount: 0, category: '' }
}
</script>

<template>
  <v-row class="mb-2">
    <v-col cols="12" class="d-flex align-center justify-space-between pb-1">
      <span class="text-subtitle-1 font-weight-medium">Resumen general</span>
      <v-btn color="primary" variant="tonal" size="small" prepend-icon="mdi-plus" @click="dialog = true">
        Agregar movimiento
      </v-btn>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card color="primary" variant="tonal" rounded="lg">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-body-2">Ingresos</span>
            <v-icon icon="mdi-arrow-up-circle" color="primary" />
          </div>
          <div class="text-h6 font-weight-bold">{{ formatCurrency(totalIncome) }}</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card color="error" variant="tonal" rounded="lg">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-body-2">Gastado</span>
            <v-icon icon="mdi-arrow-down-circle" color="error" />
          </div>
          <div class="text-h6 font-weight-bold">{{ formatCurrency(totalSpent) }}</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card color="success" variant="tonal" rounded="lg">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-body-2">Ahorrado</span>
            <v-icon icon="mdi-piggy-bank" color="success" />
          </div>
          <div class="text-h6 font-weight-bold">{{ formatCurrency(totalSaved) }}</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card color="info" variant="tonal" rounded="lg">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-body-2">Balance</span>
            <v-icon icon="mdi-wallet" color="info" />
          </div>
          <div class="text-h6 font-weight-bold">{{ formatCurrency(balance) }}</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-dialog v-model="dialog" max-width="440">
    <v-card rounded="lg">
      <v-card-title class="pt-4 px-4">Agregar movimiento</v-card-title>
      <v-card-text>
        <v-btn-toggle v-model="form.type" mandatory divided class="mb-4 w-100">
          <v-btn value="income" color="success" class="flex-1-1">
            <v-icon icon="mdi-arrow-up-circle" class="mr-1" /> Ingreso
          </v-btn>
          <v-btn value="expense" color="error" class="flex-1-1">
            <v-icon icon="mdi-arrow-down-circle" class="mr-1" /> Gasto
          </v-btn>
        </v-btn-toggle>

        <v-text-field v-model="form.description" label="Descripción" variant="outlined" density="compact" class="mb-3" />

        <v-text-field v-model="form.amount" label="Monto" type="number" prefix="$" variant="outlined" density="compact" class="mb-3" />

        <v-select
          v-if="form.type === 'expense'"
          v-model="form.category"
          :items="props.categories.map(c => c.name)"
          label="Categoría"
          variant="outlined"
          density="compact"
        />
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" :disabled="!form.amount" @click="submit">Agregar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
