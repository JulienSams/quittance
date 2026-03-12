// French legal validation rules and constants for rental receipts
// Based on requirements for "quittance de loyer location meublée"

/**
 * Mandatory fields per French law for rental receipts
 *
 * French law requires specific information on rental receipts:
 * - Landlord and tenant identification
 * - Property address
 * - Rent breakdown (ALUR law: separate rent and charges)
 */
export const FRENCH_LEGAL_FIELDS = {
  // Required fields for landlord (propriétaire)
  MANDATORY_PROPRIETAIRE: ['nom', 'prenom', 'adresse', 'codePostal', 'ville'],

  // Required fields for tenant (locataire)
  MANDATORY_LOCATAIRE: ['nom', 'prenom'],

  // Required fields for property (bien)
  MANDATORY_BIEN: ['adresse', 'codePostal', 'ville'],

  // Required fields for rent (loyer) - ALUR law requirement
  MANDATORY_LOYER: ['loyerHorsCharges', 'charges'],
}

/**
 * Validation patterns for French-specific formats
 */
export const VALIDATION_PATTERNS = {
  // French postal codes are exactly 5 digits (01000 to 95999)
  CODE_POSTAL: /^\d{5}$/,

  // French phone numbers (optional, various formats accepted)
  TELEPHONE: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,

  // Basic email validation
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}

/**
 * Legal mentions required on rental receipts
 * These will be used in Phase 4 for PDF generation
 */
export const LEGAL_MENTIONS = {
  // ALUR law (Loi pour l'Accès au Logement et un Urbanisme Rénové)
  // Requires breakdown of rent and charges
  ALUR_MENTION: 'Loyer et charges conformément à la loi ALUR (art. 3)',

  // Standard receipt mention
  RECEIPT_PURPOSE: 'Quittance de loyer pour la période mentionnée',

  // Payment confirmation
  PAYMENT_CONFIRMATION: 'Le propriétaire reconnaît avoir reçu la somme indiquée',
}

/**
 * Receipt number prefix for display
 */
export const RECEIPT_NUMBER_PREFIX = 'N° '

/**
 * Format month and year for French locale
 *
 * @param date - Date to format
 * @returns Formatted string like "Février 2026"
 */
export function formatMonthYear(date: Date): string {
  const formatted = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

/**
 * Helper to get total rent (rent + charges)
 */
export function calculateTotalRent(loyerHorsCharges: number, charges: number): number {
  return loyerHorsCharges + charges
}

/**
 * Format amount for French locale (1 234,56 €)
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}
