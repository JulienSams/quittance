import type { ReceiptData } from './receipt'

export interface SavedConfig {
  name: string
  data: ReceiptData
  savedAt: string
}

export interface ConfigListItem {
  name: string
  savedAt: Date
}
