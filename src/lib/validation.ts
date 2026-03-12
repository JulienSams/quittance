import { VALIDATION_PATTERNS, FRENCH_LEGAL_FIELDS } from './constants/french-legal'
import type { ReceiptData } from '@/types/receipt'

export interface ValidationErrors {
  proprietaire?: Record<string, string>
  locataire?: Record<string, string>
  bien?: Record<string, string>
  loyer?: Record<string, string>
  dateRange?: string
}

export function validateField(
  section: keyof ReceiptData,
  field: string,
  value: any
): string | null {
  // Check required fields
  const sectionKey = `MANDATORY_${section.toUpperCase()}` as keyof typeof FRENCH_LEGAL_FIELDS
  const mandatoryFields = FRENCH_LEGAL_FIELDS[sectionKey]

  if (mandatoryFields?.includes(field)) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'Ce champ est obligatoire'
    }
  }

  // Validate postal code format
  if (field === 'codePostal' && value) {
    if (!VALIDATION_PATTERNS.CODE_POSTAL.test(value)) {
      return 'Le code postal doit contenir 5 chiffres'
    }
  }

  // Validate loyer amounts
  if (section === 'loyer') {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue) || numValue < 0) {
      return 'Le montant doit être un nombre positif'
    }
  }

  return null
}

export function validateForm(data: ReceiptData): ValidationErrors {
  const errors: ValidationErrors = {}

  // Validate each section (only the ones that are part of ValidationErrors)
  const sections = ['proprietaire', 'locataire', 'bien', 'loyer'] as const

  sections.forEach((section) => {
    const sectionData = data[section] as Record<string, any>
    const sectionErrors: Record<string, string> = {}

    Object.entries(sectionData).forEach(([field, value]) => {
      const error = validateField(section, field, value)
      if (error) {
        sectionErrors[field] = error
      }
    })

    if (Object.keys(sectionErrors).length > 0) {
      errors[section] = sectionErrors
    }
  })

  return errors
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some(
    (sectionErrors) => sectionErrors && Object.keys(sectionErrors).length > 0
  )
}

export function validateDateRange(
  dateDebut: Date | undefined,
  dateFin: Date | undefined
): string | null {
  // Both or neither
  if ((dateDebut && !dateFin) || (!dateDebut && dateFin)) {
    return 'Les deux dates doivent être renseignées'
  }

  // If both exist, check start is before end
  if (dateDebut && dateFin) {
    if (dateDebut > dateFin) {
      return 'La date de début doit être antérieure à la date de fin'
    }
  }

  return null
}
