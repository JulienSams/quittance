import JSZip from 'jszip'
import { generateReceiptPDF } from './receipt-generator'
import type { ReceiptData } from '@/types/receipt'

/**
 * Generate a batch of receipt PDFs and package them into a ZIP file
 *
 * @param receiptData - Complete receipt data with landlord, tenant, property, and monthly receipts
 * @param onProgress - Optional callback to track progress (current, total)
 * @returns Promise<Blob> - ZIP file blob ready for download
 *
 * @example
 * ```ts
 * const zipBlob = await generateReceiptBatch(receiptData, (current, total) => {
 *   console.log(`Generating ${current}/${total}`)
 * })
 * ```
 */
export async function generateReceiptBatch(
  receiptData: ReceiptData,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const { monthlyReceipts } = receiptData

  if (!monthlyReceipts || monthlyReceipts.length === 0) {
    throw new Error('Aucune quittance à générer')
  }

  try {
    const zip = new JSZip()
    const total = monthlyReceipts.length

    // Generate each PDF and add to ZIP
    for (let i = 0; i < monthlyReceipts.length; i++) {
      const receipt = monthlyReceipts[i]
      const current = i + 1

      try {
        // Generate individual PDF
        const pdfBlob = await generateReceiptPDF(receiptData, receipt)

        // Format filename: quittance_YYYY-MM.pdf
        const year = receipt.period.year
        const month = String(receipt.period.month + 1).padStart(2, '0')
        const filename = `quittance_${year}-${month}.pdf`

        // Add to ZIP
        zip.file(filename, pdfBlob)

        // Report progress
        if (onProgress) {
          onProgress(current, total)
        }
      } catch (err) {
        const monthName = new Date(receipt.period.year, receipt.period.month).toLocaleDateString(
          'fr-FR',
          { month: 'long', year: 'numeric' }
        )
        throw new Error(
          `Erreur lors de la génération de la quittance ${monthName}: ${
            err instanceof Error ? err.message : 'erreur inconnue'
          }`
        )
      }
    }

    // Generate ZIP blob
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    return zipBlob
  } catch (err) {
    if (err instanceof Error) {
      throw err
    }
    throw new Error('Erreur lors de la génération des quittances')
  }
}

/**
 * Generate ZIP filename from receipt data
 *
 * Format: quittances_[tenantname]_YYYY-MM_YYYY-MM.zip
 *
 * @param receiptData - Receipt data containing tenant name and date range
 * @returns Filesystem-safe ZIP filename
 *
 * @example
 * ```ts
 * generateZipFilename(receiptData)
 * // => "quittances_dupont_2026-01_2026-12.zip"
 * ```
 */
export function generateZipFilename(receiptData: ReceiptData): string {
  // Normalize tenant name for filesystem
  const tenantName = receiptData.locataire.nom
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscore
    .replace(/_+/g, '_') // Collapse multiple underscores
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 30) // Truncate to 30 chars

  // Format dates as YYYY-MM
  const startDate = receiptData.dateDebut
    ? `${receiptData.dateDebut.getFullYear()}-${String(receiptData.dateDebut.getMonth() + 1).padStart(2, '0')}`
    : 'unknown'

  const endDate = receiptData.dateFin
    ? `${receiptData.dateFin.getFullYear()}-${String(receiptData.dateFin.getMonth() + 1).padStart(2, '0')}`
    : 'unknown'

  return `quittances_${tenantName}_${startDate}_${endDate}.zip`
}
