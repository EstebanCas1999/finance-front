export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount)
