import { useNotification } from './useNotification'

export type ReminderFrequency = 'daily' | 'weekly' | 'monthly'

interface GoalReminder {
  goalId: number
  goalName: string
  frequency: ReminderFrequency
  lastReminded: string | null
}

const STORAGE_KEY = 'finance_reminders'

const getAll = (): GoalReminder[] => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

const saveAll = (reminders: GoalReminder[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
}

const isDue = (reminder: GoalReminder): boolean => {
  if (!reminder.lastReminded) return true
  const last = new Date(reminder.lastReminded)
  const now = new Date()
  switch (reminder.frequency) {
    case 'daily':
      return now.toDateString() !== last.toDateString()
    case 'weekly':
      return now.getTime() - last.getTime() >= 7 * 24 * 60 * 60 * 1000
    case 'monthly':
      return now.getMonth() !== last.getMonth() || now.getFullYear() !== last.getFullYear()
  }
}

export const useReminders = () => {
  const { show } = useNotification()

  const setReminder = (goalId: number, goalName: string, frequency: ReminderFrequency) => {
    const reminders = getAll()
    const index = reminders.findIndex(r => r.goalId === goalId)
    const reminder: GoalReminder = { goalId, goalName, frequency, lastReminded: null }
    if (index >= 0) reminders[index] = reminder
    else reminders.push(reminder)
    saveAll(reminders)
  }

  const removeReminder = (goalId: number) => {
    saveAll(getAll().filter(r => r.goalId !== goalId))
  }

  const hasReminder = (goalId: number): boolean => {
    return getAll().some(r => r.goalId === goalId)
  }

  const getReminderFrequency = (goalId: number): ReminderFrequency | null => {
    return getAll().find(r => r.goalId === goalId)?.frequency ?? null
  }

  const checkDueReminders = () => {
    const reminders = getAll()
    const due = reminders.filter(isDue)
    due.forEach(r => {
      show(`Recordatorio: es momento de ahorrar para "${r.goalName}"`, 'info')
      r.lastReminded = new Date().toISOString()
    })
    if (due.length > 0) saveAll(reminders)
  }

  return { setReminder, removeReminder, hasReminder, getReminderFrequency, checkDueReminders }
}
