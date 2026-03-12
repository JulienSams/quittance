import type { GenerationHistory, HistoryListItem } from '@/types/history'

const DB_NAME = 'quittance-history'
const STORE_NAME = 'generations'
const DB_VERSION = 1

/**
 * Open IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('generatedAt', 'generatedAt', { unique: false })
      }
    }
  })
}

/**
 * Save a generation to history
 */
export async function saveGenerationToHistory(history: GenerationHistory): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const request = store.put(history)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * Get all history items (without blobs for performance)
 */
export async function getHistoryList(): Promise<HistoryListItem[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => {
      const items: HistoryListItem[] = request.result.map((item: GenerationHistory) => ({
        id: item.id,
        generatedAt: item.generatedAt,
        proprietaire: item.proprietaire,
        locataire: item.locataire,
        periode: item.periode,
        nombreQuittances: item.nombreQuittances,
        zipFilename: item.zipFilename,
      }))

      // Sort by date, most recent first
      items.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())

      resolve(items)
    }
    request.onerror = () => reject(request.error)
  })
}

/**
 * Get a specific history item with blob
 */
export async function getHistoryItem(id: string): Promise<GenerationHistory | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(id)

    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Delete a history item
 */
export async function deleteHistoryItem(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * Clear all history
 */
export async function clearHistory(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * Download a history item's ZIP
 */
export async function downloadHistoryZip(id: string): Promise<void> {
  const item = await getHistoryItem(id)
  if (!item) {
    throw new Error('Item not found in history')
  }

  const url = URL.createObjectURL(item.zipBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = item.zipFilename
  link.click()
  URL.revokeObjectURL(url)
}
