// Core data types for receipt generation
// Based on French legal requirements for "quittance de loyer location meublée"

export interface Proprietaire {
  nom: string
  prenom: string
  adresse: string
  codePostal: string
  ville: string
  // Optional contact fields
  telephone?: string
  email?: string
}

export interface Locataire {
  nom: string
  prenom: string
  // Optional contact fields
  telephone?: string
  email?: string
}

export interface Bien {
  adresse: string
  codePostal: string
  ville: string
  complement?: string // Apartment number, floor, building, etc.
  typeBien?: string // Studio, T2, T3, etc.
}

export interface Loyer {
  loyerHorsCharges: number // Rent excluding charges (ALUR law requirement)
  charges: number // Charges amount (ALUR law requirement)
}

export interface MonthPeriod {
  year: number
  month: number // 0-11 (JavaScript month index)
  startDate: Date // First day of occupation in this month
  endDate: Date // Last day of occupation in this month
  isPartial: boolean // True if not occupying full month
}

export interface ReceiptData {
  proprietaire: Proprietaire
  locataire: Locataire
  bien: Bien
  loyer: Loyer
  // Date range for batch generation (Phase 3)
  dateDebut?: Date
  dateFin?: Date
}
