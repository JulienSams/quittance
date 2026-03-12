import { useState, useEffect } from 'react'
import type { ReceiptData, MonthlyReceipt } from '@/types/receipt'
import type { ConfigListItem } from '@/types/config'
import { validateField, validateForm, validateDateRange, type ValidationErrors } from '@/lib/validation'
import { saveReceiptData, loadReceiptData } from '@/lib/storage'
import { saveConfig as saveConfigStorage, loadConfig as loadConfigStorage, deleteConfig as deleteConfigStorage, listConfigs } from '@/lib/config-storage'
import { generateMonthsInRange } from '@/lib/date-utils'
import { calculateMonthProrata } from '@/lib/prorata-calculator'

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

  // Auto-load on mount
  useEffect(() => {
    // Check if we should load a specific config (from session storage)
    const configToLoad = sessionStorage.getItem('quittance-load-config')
    if (configToLoad) {
      sessionStorage.removeItem('quittance-load-config')
      const configData = loadConfigStorage(configToLoad)
      if (configData) {
        setFormData(configData)
        return
      }
    }

    // Otherwise load default saved data
    const savedData = loadReceiptData()
    if (savedData) {
      setFormData(savedData)
    }
  }, [])

  // Auto-save on formData change (with debounce)
  useEffect(() => {
    // Skip auto-save if form is empty (initial state)
    const isEmpty =
      !formData.proprietaire.nom &&
      !formData.proprietaire.prenom &&
      !formData.locataire.nom &&
      !formData.locataire.prenom

    if (isEmpty) return

    const timeoutId = setTimeout(() => {
      saveReceiptData(formData)
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [formData])

  const updateField = (
    section: keyof Omit<ValidationErrors, 'dateRange'>,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof ReceiptData] as Record<string, any>),
        [field]: value,
      },
    }))

    // Clear error when user starts typing
    const sectionErrors = errors[section]
    if (sectionErrors && typeof sectionErrors === 'object' && field in sectionErrors) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        const currentSectionErrors = newErrors[section]
        if (currentSectionErrors && typeof currentSectionErrors === 'object') {
          const { [field]: _, ...rest } = currentSectionErrors as Record<string, string>
          if (Object.keys(rest).length === 0) {
            delete newErrors[section]
          } else {
            newErrors[section] = rest
          }
        }
        return newErrors
      })
    }
  }

  const generateReceipts = (dateDebut: Date, dateFin: Date, fullLoyer: number, fullCharges: number): MonthlyReceipt[] => {
    const months = generateMonthsInRange(dateDebut, dateFin)
    return months.map((period) => {
      const prorata = calculateMonthProrata(period, fullLoyer, fullCharges)
      return {
        period,
        loyerHorsCharges: prorata.loyerHorsCharges,
        charges: prorata.charges,
        total: prorata.total,
      }
    })
  }

  const updateDateField = (field: 'dateDebut' | 'dateFin', date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }))

    // Clear date range error when user changes a date
    if (errors.dateRange) {
      setErrors((prev) => {
        const { dateRange, ...rest } = prev
        return rest
      })
    }

    // Validate and generate receipts after updating
    setTimeout(() => {
      const updatedData = field === 'dateDebut'
        ? { ...formData, dateDebut: date }
        : { ...formData, dateFin: date }

      const error = validateDateRange(updatedData.dateDebut, updatedData.dateFin)
      if (error) {
        setErrors((prev) => ({ ...prev, dateRange: error }))
      }

      // Generate receipts if both dates are set
      if (updatedData.dateDebut && updatedData.dateFin && !error) {
        const receipts = generateReceipts(
          updatedData.dateDebut,
          updatedData.dateFin,
          formData.loyer.loyerHorsCharges,
          formData.loyer.charges
        )
        setFormData((prev) => ({ ...prev, monthlyReceipts: receipts }))
      } else {
        // Clear receipts if dates are invalid
        setFormData((prev) => ({ ...prev, monthlyReceipts: undefined }))
      }
    }, 0)
  }

  const handleBlur = (section: keyof Omit<ValidationErrors, 'dateRange'>, field: string) => {
    const value = (formData[section as keyof ReceiptData] as any)[field]
    const error = validateField(section as keyof ReceiptData, field, value)

    if (error) {
      setErrors((prev) => {
        const prevSection = prev[section]
        const prevSectionObj = prevSection && typeof prevSection === 'object' ? prevSection : {}
        return {
          ...prev,
          [section]: {
            ...prevSectionObj,
            [field]: error,
          },
        }
      })
    }
  }

  const validateAll = (): boolean => {
    const allErrors = validateForm(formData)

    // Also validate date range
    const dateError = validateDateRange(formData.dateDebut, formData.dateFin)
    if (dateError) {
      allErrors.dateRange = dateError
    }

    setErrors(allErrors)
    return Object.keys(allErrors).length === 0
  }

  // Configuration management
  const saveConfigAs = (name: string): void => {
    saveConfigStorage(name, formData)
  }

  const loadConfigByName = (name: string): void => {
    const configData = loadConfigStorage(name)
    if (configData) {
      setFormData(configData)
      setErrors({})
      // Auto-save after loading a config
      setTimeout(() => {
        saveReceiptData(configData)
      }, 0)
    }
  }

  const getAvailableConfigs = (): ConfigListItem[] => {
    return listConfigs()
  }

  const deleteConfigByName = (name: string): void => {
    deleteConfigStorage(name)
  }

  return {
    formData,
    errors,
    updateField,
    updateDateField,
    handleBlur,
    validateAll,
    // Config management
    saveConfigAs,
    loadConfigByName,
    getAvailableConfigs,
    deleteConfigByName,
  }
}
