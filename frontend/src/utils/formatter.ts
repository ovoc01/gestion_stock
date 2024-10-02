export function formatCurrency(amount: number): string {
   const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
   })
   return `${formatter.format(amount)} Ar`
}