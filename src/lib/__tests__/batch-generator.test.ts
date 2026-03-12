import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateReceiptBatch, generateZipFilename } from '../batch-generator'
import type { ReceiptData, MonthlyReceipt } from '@/types/receipt'
import * as receiptGenerator from '../receipt-generator'

// Mock the receipt generator
vi.mock('../receipt-generator', () => ({
  generateReceiptPDF: vi.fn(),
}))

describe('batch-generator', () => {
  describe('generateReceiptBatch', () => {
    const mockReceiptData: ReceiptData = {
      proprietaire: {
        nom: 'Dupont',
        prenom: 'Jean',
        adresse: '123 Rue Test',
        codePostal: '75001',
        ville: 'Paris',
      },
      locataire: {
        nom: 'Martin',
        prenom: 'Marie',
      },
      bien: {
        adresse: '456 Rue Location',
        codePostal: '75002',
        ville: 'Paris',
      },
      loyer: {
        loyerHorsCharges: 1000,
        charges: 100,
      },
      dateDebut: new Date(2026, 0, 1),
      dateFin: new Date(2026, 2, 31),
      monthlyReceipts: [
        {
          period: {
            year: 2026,
            month: 0,
            startDate: new Date(2026, 0, 1),
            endDate: new Date(2026, 0, 31),
            isPartial: false,
          },
          loyerHorsCharges: 1000,
          charges: 100,
          total: 1100,
        },
        {
          period: {
            year: 2026,
            month: 1,
            startDate: new Date(2026, 1, 1),
            endDate: new Date(2026, 1, 28),
            isPartial: false,
          },
          loyerHorsCharges: 1000,
          charges: 100,
          total: 1100,
        },
        {
          period: {
            year: 2026,
            month: 2,
            startDate: new Date(2026, 2, 1),
            endDate: new Date(2026, 2, 31),
            isPartial: false,
          },
          loyerHorsCharges: 1000,
          charges: 100,
          total: 1100,
        },
      ],
    }

    beforeEach(() => {
      vi.clearAllMocks()
      // Mock generateReceiptPDF to return a fake Blob
      vi.mocked(receiptGenerator.generateReceiptPDF).mockResolvedValue(
        new Blob(['fake pdf content'], { type: 'application/pdf' })
      )
    })

    it('generates ZIP with correct number of files', async () => {
      const zipBlob = await generateReceiptBatch(mockReceiptData)

      expect(zipBlob).toBeInstanceOf(Blob)
      expect(receiptGenerator.generateReceiptPDF).toHaveBeenCalledTimes(3)
    })

    it('calls progress callback for each receipt', async () => {
      const onProgress = vi.fn()

      await generateReceiptBatch(mockReceiptData, onProgress)

      expect(onProgress).toHaveBeenCalledTimes(3)
      expect(onProgress).toHaveBeenNthCalledWith(1, 1, 3)
      expect(onProgress).toHaveBeenNthCalledWith(2, 2, 3)
      expect(onProgress).toHaveBeenNthCalledWith(3, 3, 3)
    })

    it('throws error if monthlyReceipts is empty', async () => {
      const emptyData: ReceiptData = {
        ...mockReceiptData,
        monthlyReceipts: [],
      }

      await expect(generateReceiptBatch(emptyData)).rejects.toThrow(
        'Aucune quittance à générer'
      )
    })

    it('throws error if generateReceiptPDF fails', async () => {
      vi.mocked(receiptGenerator.generateReceiptPDF).mockRejectedValueOnce(
        new Error('PDF generation failed')
      )

      await expect(generateReceiptBatch(mockReceiptData)).rejects.toThrow(
        'Erreur lors de la génération de la quittance'
      )
    })

    it('generates correct filename format for each receipt', async () => {
      await generateReceiptBatch(mockReceiptData)

      // Verify generateReceiptPDF was called with correct receipts
      expect(receiptGenerator.generateReceiptPDF).toHaveBeenNthCalledWith(
        1,
        mockReceiptData,
        mockReceiptData.monthlyReceipts![0]
      )
      expect(receiptGenerator.generateReceiptPDF).toHaveBeenNthCalledWith(
        2,
        mockReceiptData,
        mockReceiptData.monthlyReceipts![1]
      )
      expect(receiptGenerator.generateReceiptPDF).toHaveBeenNthCalledWith(
        3,
        mockReceiptData,
        mockReceiptData.monthlyReceipts![2]
      )
    })
  })

  describe('generateZipFilename', () => {
    const baseReceiptData: ReceiptData = {
      proprietaire: {
        nom: 'Dupont',
        prenom: 'Jean',
        adresse: '123 Rue Test',
        codePostal: '75001',
        ville: 'Paris',
      },
      locataire: {
        nom: 'Martin',
        prenom: 'Marie',
      },
      bien: {
        adresse: '456 Rue Location',
        codePostal: '75002',
        ville: 'Paris',
      },
      loyer: {
        loyerHorsCharges: 1000,
        charges: 100,
      },
      dateDebut: new Date(2026, 0, 1), // January 2026
      dateFin: new Date(2026, 11, 31), // December 2026
    }

    it('generates correct filename for basic case', () => {
      const filename = generateZipFilename(baseReceiptData)

      expect(filename).toBe('quittances_martin_2026-01_2026-12.zip')
    })

    it('normalizes names with accents', () => {
      const dataWithAccents: ReceiptData = {
        ...baseReceiptData,
        locataire: { nom: 'François', prenom: 'Marie' },
      }

      const filename = generateZipFilename(dataWithAccents)

      expect(filename).toBe('quittances_francois_2026-01_2026-12.zip')
    })

    it('normalizes names with spaces', () => {
      const dataWithSpaces: ReceiptData = {
        ...baseReceiptData,
        locataire: { nom: 'Le Blanc', prenom: 'Marie' },
      }

      const filename = generateZipFilename(dataWithSpaces)

      expect(filename).toBe('quittances_le_blanc_2026-01_2026-12.zip')
    })

    it('normalizes names with special characters', () => {
      const dataWithSpecialChars: ReceiptData = {
        ...baseReceiptData,
        locataire: { nom: "O'Connor-Smith", prenom: 'John' },
      }

      const filename = generateZipFilename(dataWithSpecialChars)

      expect(filename).toBe('quittances_o_connor_smith_2026-01_2026-12.zip')
    })

    it('truncates long names to 30 characters', () => {
      const dataWithLongName: ReceiptData = {
        ...baseReceiptData,
        locataire: {
          nom: 'VeryLongNameThatExceedsThirtyCharactersLimit',
          prenom: 'Test',
        },
      }

      const filename = generateZipFilename(dataWithLongName)
      const namePart = filename.split('_')[1]

      expect(namePart.length).toBeLessThanOrEqual(30)
    })

    it('collapses multiple underscores', () => {
      const dataWithMultipleSpaces: ReceiptData = {
        ...baseReceiptData,
        locataire: { nom: 'Le    Blanc', prenom: 'Marie' },
      }

      const filename = generateZipFilename(dataWithMultipleSpaces)

      expect(filename).toBe('quittances_le_blanc_2026-01_2026-12.zip')
      expect(filename).not.toContain('__')
    })

    it('formats dates correctly', () => {
      const dataWithDifferentDates: ReceiptData = {
        ...baseReceiptData,
        dateDebut: new Date(2025, 5, 1), // June 2025
        dateFin: new Date(2025, 8, 30), // September 2025
      }

      const filename = generateZipFilename(dataWithDifferentDates)

      expect(filename).toContain('2025-06_2025-09')
    })
  })
})
