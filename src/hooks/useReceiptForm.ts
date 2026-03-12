import { useState } from 'react'
import type { ReceiptData } from '@/types/receipt'

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
  }

  return {
    formData,
    updateField,
  }
}
