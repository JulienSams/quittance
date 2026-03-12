import type { ReceiptData } from '@/types/receipt'

const STORAGE_KEY = 'quittance-receipt-data'

export function saveReceiptData(data: ReceiptData): void {
  try {
    // Serialize dates to ISO strings (including nested dates in monthlyReceipts)
    const dataToSave: any = {
      ...data,
      dateDebut: data.dateDebut?.toISOString(),
      dateFin: data.dateFin?.toISOString(),
    }

    if (data.monthlyReceipts) {
      dataToSave.monthlyReceipts = data.monthlyReceipts.map(receipt => ({
        ...receipt,
        period: {
          ...receipt.period,
          startDate: receipt.period.startDate.toISOString(),
          endDate: receipt.period.endDate.toISOString(),
        },
      }))
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

    // Deserialize dates in monthlyReceipts
    if (data.monthlyReceipts) {
      data.monthlyReceipts = data.monthlyReceipts.map((receipt: any) => ({
        ...receipt,
        period: {
          ...receipt.period,
          startDate: new Date(receipt.period.startDate),
          endDate: new Date(receipt.period.endDate),
        },
      }))
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
