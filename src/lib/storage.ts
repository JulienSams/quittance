import type { ReceiptData } from '@/types/receipt'

const STORAGE_KEY = 'quittance-receipt-data'

export function saveReceiptData(data: ReceiptData): void {
  try {
    const json = JSON.stringify(data)
    localStorage.setItem(STORAGE_KEY, json)
  } catch (error) {
    console.error('Failed to save data:', error)
    // Handle quota exceeded or other errors
    throw new Error('Impossible de sauvegarder les données')
  }
}

export function loadReceiptData(): ReceiptData | null {
  try {
    const json = localStorage.getItem(STORAGE_KEY)
    if (!json) return null

    const data = JSON.parse(json)
    return data
  } catch (error) {
    console.error('Failed to load data:', error)
    return null
  }
}

export function clearReceiptData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear data:', error)
  }
}
