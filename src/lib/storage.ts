import type { ReceiptData } from '@/types/receipt'

const STORAGE_KEY = 'quittance-receipt-data'

export function saveReceiptData(data: ReceiptData): void {
  try {
    // Serialize dates to ISO strings
    const dataToSave = {
      ...data,
      dateDebut: data.dateDebut?.toISOString(),
      dateFin: data.dateFin?.toISOString(),
    }
    const json = JSON.stringify(dataToSave)
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

    // Deserialize ISO strings back to Date objects
    if (data.dateDebut) {
      data.dateDebut = new Date(data.dateDebut)
    }
    if (data.dateFin) {
      data.dateFin = new Date(data.dateFin)
    }

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
