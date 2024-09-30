export function formatCurrency(amount: number): string {
   const formatter = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
   })
   return `${formatter.format(amount)} Ar`
}