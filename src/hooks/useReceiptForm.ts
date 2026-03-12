import { useState } from 'react'
import type { ReceiptData } from '@/types/receipt'
import { validateField, validateForm, type ValidationErrors } from '@/lib/validation'

export function useReceiptForm() {
  const [formData, setFormData] = useState<ReceiptData>({
    proprietaire: {
      nom: '',
      prenom: '',
      adresse: '',
      codePostal: '',
      ville: '',
    },
    locataire: {
      nom: '',
      prenom: '',
    },
    bien: {
      adresse: '',
      codePostal: '',
      ville: '',
    },
    loyer: {
      loyerHorsCharges: 0,
      charges: 0,
    },
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  const updateField = (
    section: keyof ReceiptData,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))

    // Clear error when user starts typing
    if (errors[section]?.[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        if (newErrors[section]) {
          const { [field]: _, ...rest } = newErrors[section]!
          newErrors[section] = rest
          if (Object.keys(rest).length === 0) {
            delete newErrors[section]
          }
        }
        return newErrors
      })
    }
  }

  const handleBlur = (section: keyof ReceiptData, field: string) => {
    const fieldKey = `${section}.${field}`
    setTouchedFields((prev) => new Set(prev).add(fieldKey))

    const value = (formData[section] as any)[field]
    const error = validateField(section, field, value)

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: error,
        },
      }))
    }
  }

  const validateAll = (): boolean => {
    const allErrors = validateForm(formData)
    setErrors(allErrors)
    return Object.keys(allErrors).length === 0
  }

  return {
    formData,
    errors,
    updateField,
    handleBlur,
    validateAll,
  }
}
