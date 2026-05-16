import { defineComponent, ref, computed } from 'vue'
import SummaryCards from '@/components/dashboard/SummaryCards.vue'
import SavingGoals from '@/components/dashboard/SavingGoals.vue'
import SavingPlatforms from '@/components/dashboard/SavingPlatforms.vue'
import ExpenseCategories from '@/components/dashboard/ExpenseCategories.vue'
import MonthYearSelector from '@/components/dashboard/MonthYearSelector.vue'
import { useNotification } from '@/composables/useNotification'
import { formatCurrency } from '@/utils/format'

interface SavingGoal {
  id: number
  name: string
  icon: string
  target: number
  current: number
  color: string
}

interface Category {
  name: string
  icon: string
  amount: number
  color: string
}

interface Platform {
  name: string
  amount: number
  color: string
  icon: string
}

export default defineComponent({
  components: { SummaryCards, SavingGoals, SavingPlatforms, ExpenseCategories, MonthYearSelector },

  setup() {
    const { show } = useNotification()

    const selectedMonth = ref(new Date().getMonth() + 1)
    const selectedYear = ref(new Date().getFullYear())

    const totalIncome = ref(18500)
    const totalSpent = ref(7250)
    const totalSaved = ref(2800)
    const balance = computed(() => totalIncome.value - totalSpent.value)

    const savingGoals = ref<SavingGoal[]>([
      { id: 1, name: 'Vacaciones', icon: 'mdi-airplane', target: 15000, current: 6500, color: 'blue' },
      { id: 2, name: 'Fondo de emergencia', icon: 'mdi-shield-check', target: 30000, current: 18000, color: 'green' },
      { id: 3, name: 'Laptop nueva', icon: 'mdi-laptop', target: 25000, current: 9000, color: 'deep-purple' },
    ])

    const categories = ref<Category[]>([
      { name: 'Renta', icon: 'mdi-home', amount: 1500, color: 'red' },
      { name: 'Comida', icon: 'mdi-food', amount: 800, color: 'orange' },
      { name: 'Transporte', icon: 'mdi-car', amount: 450, color: 'blue' },
      { name: 'Entretenimiento', icon: 'mdi-gamepad-variant', amount: 300, color: 'purple' },
      { name: 'Salud', icon: 'mdi-heart-pulse', amount: 200, color: 'pink' },
      { name: 'Otros', icon: 'mdi-dots-horizontal-circle', amount: 1000, color: 'grey' },
    ])

    const platforms = ref<Platform[]>([
      { name: 'CETES Directo', amount: 12000, color: 'green', icon: 'mdi-bank' },
      { name: 'Nu', amount: 5500, color: 'deep-purple', icon: 'mdi-credit-card' },
      { name: 'GBM+', amount: 8200, color: 'blue', icon: 'mdi-chart-line' },
      { name: 'Efectivo', amount: 1300, color: 'orange', icon: 'mdi-cash' },
    ])

    const totalPlatforms = computed(() =>
      platforms.value.reduce((sum, p) => sum + p.amount, 0)
    )

    const onAddTransaction = ({ type, amount, category }: { type: 'income' | 'expense'; amount: number; category: string }) => {
      if (type === 'income') {
        totalIncome.value += amount
        show('Ingreso agregado correctamente', 'success')
      } else {
        totalSpent.value += amount
        const cat = categories.value.find(c => c.name === category)
        if (cat) cat.amount += amount
        show('Gasto registrado correctamente', 'success')
      }
    }

    const onAddGoal = (goal: SavingGoal) => {
      savingGoals.value.push(goal)
      show(`Meta "${goal.name}" creada`, 'success')
    }

    const onAddPlatform = (platform: Platform) => {
      platforms.value.push(platform)
      totalSaved.value += platform.amount
      show(`Plataforma "${platform.name}" agregada`, 'success')
    }

    const onDepositPlatform = ({ name, amount }: { name: string; amount: number }) => {
      const platform = platforms.value.find(p => p.name === name)
      if (!platform) return
      platform.amount += amount
      totalSaved.value += amount
      show(`Depósito de ${formatCurrency(amount)} en ${name}`, 'success')
    }

    return {
      selectedMonth,
      selectedYear,
      totalIncome,
      totalSpent,
      totalSaved,
      balance,
      savingGoals,
      categories,
      platforms,
      totalPlatforms,
      onAddTransaction,
      onAddGoal,
      onAddPlatform,
      onDepositPlatform,
    }
  },
})
