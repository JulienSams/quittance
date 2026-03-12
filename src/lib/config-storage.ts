import type { ReceiptData } from '@/types/receipt'
import type { SavedConfig, ConfigListItem } from '@/types/config'

const CONFIG_PREFIX = 'quittance-config-'
const CONFIG_INDEX_KEY = 'quittance-config-index'

/**
 * Get list of all saved configuration names
 */
function getConfigIndex(): string[] {
  try {
    const json = localStorage.getItem(CONFIG_INDEX_KEY)
    return json ? JSON.parse(json) : []
  } catch {
    return []
  }
}

/**
 * Update the config index
 */
function updateConfigIndex(configs: string[]): void {
  localStorage.setItem(CONFIG_INDEX_KEY, JSON.stringify(configs))
}

/**
 * Add a config name to the index
 */
function addToIndex(name: string): void {
  const index = getConfigIndex()
  if (!index.includes(name)) {
    index.push(name)
    updateConfigIndex(index)
  }
}

/**
 * Remove a config name from the index
 */
function removeFromIndex(name: string): void {
  const index = getConfigIndex()
  const filtered = index.filter(n => n !== name)
  updateConfigIndex(filtered)
}

/**
 * Save a configuration with a custom name
 */
export function saveConfig(name: string, data: ReceiptData): void {
  if (!name.trim()) {
    throw new Error('Le nom de la configuration ne peut pas être vide')
  }

  try {
    // Serialize dates to ISO strings
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

    const config: SavedConfig = {
      name,
      data: dataToSave,
      savedAt: new Date().toISOString(),
    }

    const key = CONFIG_PREFIX + name
    localStorage.setItem(key, JSON.stringify(config))
    addToIndex(name)
  } catch (error) {
    console.error('Failed to save config:', error)
    throw new Error('Impossible de sauvegarder la configuration')
  }
}

/**
 * Load a configuration by name
 */
export function loadConfig(name: string): ReceiptData | null {
  try {
    const key = CONFIG_PREFIX + name
    const json = localStorage.getItem(key)
    if (!json) return null

    const config: SavedConfig = JSON.parse(json)
    const data = config.data

    // Deserialize ISO strings back to Date objects
    if (data.dateDebut) {
      data.dateDebut = new Date(data.dateDebut as any)
    }
    if (data.dateFin) {
      data.dateFin = new Date(data.dateFin as any)
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
    console.error('Failed to load config:', error)
    return null
  }
}

/**
 * Delete a configuration by name
 */
export function deleteConfig(name: string): void {
  try {
    const key = CONFIG_PREFIX + name
    localStorage.removeItem(key)
    removeFromIndex(name)
  } catch (error) {
    console.error('Failed to delete config:', error)
    throw new Error('Impossible de supprimer la configuration')
  }
}

/**
 * List all saved configurations
 */
export function listConfigs(): ConfigListItem[] {
  try {
    const names = getConfigIndex()
    const configs: ConfigListItem[] = []

    for (const name of names) {
      const key = CONFIG_PREFIX + name
      const json = localStorage.getItem(key)
      if (json) {
        try {
          const config: SavedConfig = JSON.parse(json)
          configs.push({
            name: config.name,
            savedAt: new Date(config.savedAt),
          })
        } catch {
          // Skip invalid configs
        }
      }
    }

    // Sort by date (most recent first)
    return configs.sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime())
  } catch (error) {
    console.error('Failed to list configs:', error)
    return []
  }
}

/**
 * Check if a configuration name already exists
 */
export function configExists(name: string): boolean {
  const key = CONFIG_PREFIX + name
  return localStorage.getItem(key) !== null
}
