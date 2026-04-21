/**
 * Generates a unique tag code per item.
 * Format: ORDER_NUMBER-ITEM_INDEX (e.g. "1432-03")
 */
export function generateTagCode(orderNumber: string | number, itemIndex: number): string {
  const padded = String(itemIndex).padStart(2, '0')
  return `${orderNumber}-${padded}`
}
