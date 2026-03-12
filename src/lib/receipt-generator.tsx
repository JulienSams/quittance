import { pdf } from '@react-pdf/renderer'
import { ReceiptPDF } from '@/components/ReceiptPDF'
import type { ReceiptData, MonthlyReceipt } from '@/types/receipt'

/**
 * Generate a PDF receipt for a single month
 *
 * @param receiptData - Landlord, tenant, and property information
 * @param monthlyReceipt - Month period and calculated amounts
 * @returns Promise<Blob> - PDF blob ready for download or batch processing
 *
 * @example
 * ```ts
 * const blob = await generateReceiptPDF(receiptData, monthlyReceipt)
 * const url = URL.createObjectURL(blob)
 * // Use url for download or preview
 * ```
 */
export async function generateReceiptPDF(
  receiptData: ReceiptData,
  monthlyReceipt: MonthlyReceipt
): Promise<Blob> {
  try {
    // Validate required data
    if (!receiptData.proprietaire || !receiptData.locataire || !receiptData.bien) {
      throw new Error('Missing required receipt data: proprietaire, locataire, or bien')
    }

    if (!monthlyReceipt.period) {
      throw new Error('Missing required monthly receipt period')
    }

    // Render PDF component to blob
    const blob = await pdf(
      <ReceiptPDF receiptData={receiptData} monthlyReceipt={monthlyReceipt} />
    ).toBlob()

    return blob
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to generate receipt PDF: ${message}`)
  }
}
