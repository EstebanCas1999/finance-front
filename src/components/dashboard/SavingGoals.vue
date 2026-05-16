<script setup lang="ts">
import { ref } from 'vue'
import { formatCurrency } from '@/utils/format'
import { ICON_OPTIONS, COLOR_OPTIONS } from '@/constants/dashboard'
import { useReminders, type ReminderFrequency } from '@/composables/useReminders'

interface SavingGoal {
  id: number
  name: string
  icon: string
  target: number
  current: number
  color: string
}

defineProps<{ savingGoals: SavingGoal[] }>()

const emit = defineEmits<{
  addGoal: [SavingGoal]
}>()

const { setReminder, removeReminder, hasReminder, getReminderFrequency } = useReminders()

const FREQUENCY_OPTIONS = [
  { title: 'Diario', value: 'daily' },
  { title: 'Semanal', value: 'weekly' },
  { title: 'Mensual', value: 'monthly' },
]

const dialog = ref(false)
const reminderDialog = ref(false)
const selectedGoal = ref<SavingGoal | null>(null)
const selectedFrequency = ref<ReminderFrequency>('monthly')

const form = ref({ name: '', target: 0, current: 0, icon: 'mdi-piggy-bank', color: 'blue', reminder: null as ReminderFrequency | null })

const goalProgress = (goal: SavingGoal) => Math.round((goal.current / goal.target) * 100)

const submit = () => {
  const goal: SavingGoal = {
    id: Date.now(),
    name: form.value.name,
    icon: form.value.icon,
    color: form.value.color,
    target: Number(form.value.target),
    current: Number(form.value.current),
  }
  emit('addGoal', goal)
  if (form.value.reminder) setReminder(goal.id, goal.name, form.value.reminder)
  dialog.value = false
  form.value = { name: '', target: 0, current: 0, icon: 'mdi-piggy-bank', color: 'blue', reminder: null }
}

const openReminderDialog = (goal: SavingGoal) => {
  selectedGoal.value = goal
  selectedFrequency.value = getReminderFrequency(goal.id) ?? 'monthly'
  reminderDialog.value = true
}

const saveReminder = () => {
  if (selectedGoal.value) setReminder(selectedGoal.value.id, selectedGoal.value.name, selectedFrequency.value)
  reminderDialog.value = false
}

const deleteReminder = () => {
  if (selectedGoal.value) removeReminder(selectedGoal.value.id)
  reminderDialog.value = false
}
</script>

<template>
  <v-card rounded="lg" height="100%">
    <v-card-title class="d-flex align-center justify-space-between pt-4 px-4">
      <div class="d-flex align-center gap-2">
        <v-icon icon="mdi-flag-checkered" color="primary" />
        Metas de ahorro
      </div>
      <v-btn color="primary" variant="tonal" size="small" icon="mdi-plus" @click="dialog = true" />
    </v-card-title>

    <v-card-text>
      <div v-for="goal in savingGoals" :key="goal.id" class="mb-5">
        <div class="d-flex align-center justify-space-between mb-1">
          <div class="d-flex align-center gap-2">
            <v-icon :icon="goal.icon" :color="goal.color" size="20" />
            <span class="text-body-2 font-weight-medium">{{ goal.name }}</span>
            <v-icon
              v-if="hasReminder(goal.id)"
              icon="mdi-bell"
              size="16"
              color="warning"
            />
          </div>
          <div class="d-flex align-center gap-1">
            <span class="text-body-2 text-medium-emphasis">
              {{ formatCurrency(goal.current) }} / {{ formatCurrency(goal.target) }}
            </span>
            <v-btn
              :icon="hasReminder(goal.id) ? 'mdi-bell' : 'mdi-bell-outline'"
              :color="hasReminder(goal.id) ? 'warning' : 'default'"
              variant="text"
              size="x-small"
              @click="openReminderDialog(goal)"
            />
          </div>
        </div>
        <v-progress-linear :model-value="goalProgress(goal)" :color="goal.color" rounded height="8" />
        <div class="text-right mt-1">
          <span class="text-caption text-medium-emphasis">{{ goalProgress(goal) }}%</span>
        </div>
      </div>
    </v-card-text>
  </v-card>

  <!-- Dialog: Nueva meta -->
  <v-dialog v-model="dialog" max-width="440">
    <v-card rounded="lg">
      <v-card-title class="pt-4 px-4">Nueva meta de ahorro</v-card-title>
      <v-card-text>
        <v-text-field v-model="form.name" label="Nombre de la meta" variant="outlined" density="compact" class="mb-3" />
        <v-text-field v-model="form.target" label="Monto objetivo" type="number" prefix="$" variant="outlined" density="compact" class="mb-3" />
        <v-text-field v-model="form.current" label="Monto actual" type="number" prefix="$" variant="outlined" density="compact" class="mb-3" />
        <v-select v-model="form.icon" :items="ICON_OPTIONS" item-title="label" item-value="value" label="Icono" variant="outlined" density="compact" class="mb-3" />
        <v-select v-model="form.color" :items="COLOR_OPTIONS" label="Color" variant="outlined" density="compact" class="mb-3" />
        <v-select
          v-model="form.reminder"
          :items="FREQUENCY_OPTIONS"
          item-title="title"
          item-value="value"
          label="Recordatorio (opcional)"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" :disabled="!form.name || !form.target" @click="submit">Agregar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog: Recordatorio -->
  <v-dialog v-model="reminderDialog" max-width="360">
    <v-card rounded="lg">
      <v-card-title class="pt-4 px-4 d-flex align-center gap-2">
        <v-icon icon="mdi-bell" color="warning" />
        Recordatorio — {{ selectedGoal?.name }}
      </v-card-title>
      <v-card-text>
        <v-select
          v-model="selectedFrequency"
          :items="FREQUENCY_OPTIONS"
          item-title="title"
          item-value="value"
          label="Frecuencia"
          variant="outlined"
          density="compact"
        />
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-btn v-if="selectedGoal && hasReminder(selectedGoal.id)" color="error" variant="text" @click="deleteReminder">
          Eliminar
        </v-btn>
        <v-spacer />
        <v-btn variant="text" @click="reminderDialog = false">Cancelar</v-btn>
        <v-btn color="warning" variant="flat" @click="saveReminder">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
