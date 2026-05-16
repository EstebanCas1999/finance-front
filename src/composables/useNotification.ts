import { useToast } from 'vue-toastification'

export const useNotification = () => {
  const toast = useToast()

  const show = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    toast[type](message)
  }

  return { show }
}
