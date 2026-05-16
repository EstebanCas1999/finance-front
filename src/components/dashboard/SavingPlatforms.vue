<script setup lang="ts">
import { ref } from 'vue'
import { formatCurrency } from '@/utils/format'
import { ICON_OPTIONS, COLOR_OPTIONS } from '@/constants/dashboard'

interface Platform {
  name: string
  amount: number
  color: string
  icon: string
}

defineProps<{
  platforms: Platform[]
  totalPlatforms: number
}>()

const emit = defineEmits<{
  addPlatform: [Platform]
  depositPlatform: [{ name: string; amount: number }]
}>()

const newDialog = ref(false)
const depositDialog = ref(false)
const selectedPlatform = ref<Platform | null>(null)
const depositAmount = ref(0)

const form = ref({ name: '', amount: 0, icon: 'mdi-bank', color: 'green' })

const openDeposit = (platform: Platform) => {
  selectedPlatform.value = platform
  depositAmount.value = 0
  depositDialog.value = true
}

const submitNew = () => {
  emit('addPlatform', { ...form.value, amount: Number(form.value.amount) })
  newDialog.value = false
  form.value = { name: '', amount: 0, icon: 'mdi-bank', color: 'green' }
}

const submitDeposit = () => {
  if (!selectedPlatform.value) return
  emit('depositPlatform', { name: selectedPlatform.value.name, amount: Number(depositAmount.value) })
  depositDialog.value = false
}
</script>

<template>
  <v-card rounded="lg" height="100%">
    <v-card-title class="d-flex align-center justify-space-between pt-4 px-4">
      <div class="d-flex align-center gap-2">
        <v-icon icon="mdi-bank-outline" color="primary" />
        Plataformas de ahorro
      </div>
      <v-btn color="primary" variant="tonal" size="small" icon="mdi-plus" @click="newDialog = true" />
    </v-card-title>
    <v-card-subtitle class="px-4">Total: {{ formatCurrency(totalPlatforms) }}</v-card-subtitle>

    <v-list lines="two">
      <v-list-item v-for="platform in platforms" :key="platform.name" rounded="lg">
        <template #prepend>
          <v-icon :icon="platform.icon" :color="platform.color" class="mr-3" />
        </template>
        <template #title>
          <span class="text-body-2 font-weight-medium">{{ platform.name }}</span>
        </template>
        <template #subtitle>
          <v-progress-linear
            :model-value="(platform.amount / totalPlatforms) * 100"
            :color="platform.color"
            rounded
            height="4"
            class="mt-1"
          />
        </template>
        <template #append>
          <div class="d-flex align-center gap-2">
            <span class="text-body-2 font-weight-bold">{{ formatCurrency(platform.amount) }}</span>
            <v-btn
              icon="mdi-plus-circle-outline"
              :color="platform.color"
              variant="text"
              size="small"
              @click="openDeposit(platform)"
            />
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-card>

  <!-- Dialog: Nueva plataforma -->
  <v-dialog v-model="newDialog" max-width="440">
    <v-card rounded="lg">
      <v-card-title class="pt-4 px-4">Nueva plataforma</v-card-title>
      <v-card-text>
        <v-text-field v-model="form.name" label="Nombre de la plataforma" variant="outlined" density="compact" class="mb-3" />
        <v-text-field v-model="form.amount" label="Monto inicial" type="number" prefix="$" variant="outlined" density="compact" class="mb-3" />
        <v-select v-model="form.icon" :items="ICON_OPTIONS" item-title="label" item-value="value" label="Icono" variant="outlined" density="compact" class="mb-3" />
        <v-select v-model="form.color" :items="COLOR_OPTIONS" label="Color" variant="outlined" density="compact" />
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="newDialog = false">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" :disabled="!form.name || !form.amount" @click="submitNew">Agregar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog: Depositar -->
  <v-dialog v-model="depositDialog" max-width="360">
    <v-card rounded="lg">
      <v-card-title class="pt-4 px-4 d-flex align-center gap-2">
        <v-icon :icon="selectedPlatform?.icon" :color="selectedPlatform?.color" />
        {{ selectedPlatform?.name }}
      </v-card-title>
      <v-card-subtitle class="px-4">
        Saldo actual: {{ formatCurrency(selectedPlatform?.amount ?? 0) }}
      </v-card-subtitle>
      <v-card-text class="pt-4">
        <v-text-field
          v-model="depositAmount"
          label="Monto a depositar"
          type="number"
          prefix="$"
          variant="outlined"
          density="compact"
          autofocus
        />
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="depositDialog = false">Cancelar</v-btn>
        <v-btn color="success" variant="flat" :disabled="!depositAmount" @click="submitDeposit">Depositar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
