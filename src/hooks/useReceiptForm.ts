import { useState, useEffect } from 'react'
import type { ReceiptData } from '@/types/receipt'
import { validateField, validateForm, type ValidationErrors } from '@/lib/validation'
import { saveReceiptData, loadReceiptData, clearReceiptData } from '@/lib/storage'

const initialFormData: ReceiptData = {
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
}

export function useReceiptForm() {
  const [formData, setFormData] = useState<ReceiptData>(initialFormData)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Auto-load on mount
  useEffect(() => {
    const savedData = loadReceiptData()
    if (savedData) {
      setFormData(savedData)
    }
  }, [])

  const updateField = (
    section: keyof ValidationErrors,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, any>),
        [field]: value,
      },
    }))

    // Clear error when user starts typing
    if (errors[section]?.[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        if (newErrors[section]) {
          const { [field]: _, ...rest} = newErrors[section]!
          newErrors[section] = rest
          if (Object.keys(rest).length === 0) {
            delete newErrors[section]
          }
        }
        return newErrors
      })
    }
  }

  const handleBlur = (section: keyof ValidationErrors, field: string) => {
    const value = (formData[section as keyof ReceiptData] as any)[field]
    const error = validateField(section as keyof ReceiptData, field, value)

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

  const save = async (): Promise<boolean> => {
    // Validate before saving
    if (!validateAll()) {
      return false
    }

    setIsSaving(true)
    setSaveSuccess(false)

    try {
      saveReceiptData(formData)
      setSaveSuccess(true)

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)

      return true
    } catch (error) {
      console.error('Save failed:', error)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    if (window.confirm('Voulez-vous vraiment effacer toutes les données ?')) {
      clearReceiptData()
      setFormData(initialFormData)
      setErrors({})
    }
  }

  return {
    formData,
    errors,
    isSaving,
    saveSuccess,
    updateField,
    handleBlur,
    validateAll,
    save,
    resetForm,
  }
}
