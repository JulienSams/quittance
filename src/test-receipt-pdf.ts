/**
 * Test script for PDF receipt generation
 * Tests both full month and partial month receipts with French characters
 * Run this in the browser console or add as a button in the app
 */

import { generateReceiptPDF } from './lib/receipt-generator.tsx'
import type { ReceiptData, MonthlyReceipt } from './types/receipt'

// Test data with French characters
const testReceiptData: ReceiptData = {
  proprietaire: {
    nom: 'Dupré',
    prenom: 'François',
    adresse: '12 rue de l\'Église',
    codePostal: '75001',
    ville: 'Paris',
    telephone: '01 42 56 78 90',
    email: 'francois.dupre@example.fr',
  },
  locataire: {
    nom: 'Beauséjour',
    prenom: 'Éléonore',
    telephone: '06 12 34 56 78',
    email: 'eleonore.beausejour@example.fr',
  },
  bien: {
    adresse: '25 avenue des Champs-Élysées',
    complement: 'Appartement 3B, 2ème étage',
    codePostal: '75008',
    ville: 'Paris',
    typeBien: 'T3 meublé',
  },
  loyer: {
    loyerHorsCharges: 1200,
    charges: 150,
  },
}

// Test 1: Full month receipt (February 2026, 28 days)
const fullMonthReceipt: MonthlyReceipt = {
  period: {
    year: 2026,
    month: 1, // February (0-indexed)
    startDate: new Date(2026, 1, 1),
    endDate: new Date(2026, 1, 28),
    isPartial: false,
  },
  loyerHorsCharges: 1200,
  charges: 150,
  total: 1350,
}

// Test 2: Partial month receipt (February 2026, 15th-28th = 14 days)
const partialMonthReceipt: MonthlyReceipt = {
  period: {
    year: 2026,
    month: 1, // February (0-indexed)
    startDate: new Date(2026, 1, 15),
    endDate: new Date(2026, 1, 28),
    isPartial: true,
  },
  loyerHorsCharges: 600, // Prorated: (1200/28) * 14 = 600
  charges: 75, // Prorated: (150/28) * 14 = 75
  total: 675,
}

/**
 * Test PDF generation and download
 */
export async function testPDFGeneration() {
  console.log('🧪 Testing PDF receipt generation...')

  try {
    // Test 1: Full month
    console.log('\n📄 Test 1: Generating full month receipt (February 2026)...')
    const fullMonthBlob = await generateReceiptPDF(testReceiptData, fullMonthReceipt)
    downloadPDF(fullMonthBlob, 'test-quittance-fevrier-2026-complet.pdf')
    console.log('✅ Full month receipt generated successfully')
    console.log(`   Size: ${(fullMonthBlob.size / 1024).toFixed(2)} KB`)

    // Test 2: Partial month
    console.log('\n📄 Test 2: Generating partial month receipt (Feb 15-28, 2026)...')
    const partialMonthBlob = await generateReceiptPDF(testReceiptData, partialMonthReceipt)
    downloadPDF(partialMonthBlob, 'test-quittance-fevrier-2026-partiel.pdf')
    console.log('✅ Partial month receipt generated successfully')
    console.log(`   Size: ${(partialMonthBlob.size / 1024).toFixed(2)} KB`)

    console.log('\n✅ All tests passed! Check your downloads folder.')
    console.log('\n📋 Verify the following in the PDFs:')
    console.log('   □ Traditional layout structure (centered title, two columns)')
    console.log('   □ Receipt number in format 2026-02-001 (top right)')
    console.log('   □ Dark blue (#1e3a8a) accent on headers and table')
    console.log('   □ Landlord and tenant side-by-side')
    console.log('   □ Property section after parties')
    console.log('   □ ALUR-compliant rent breakdown table with borders')
    console.log('   □ French currency formatting (1 200,00 €)')
    console.log('   □ Prorata note ONLY in partial month PDF')
    console.log('   □ Legal mentions in footer')
    console.log('   □ Generation date at bottom')
    console.log('   □ All French characters render correctly (é, è, à, ô, ç)')
    console.log('   □ Print quality and readability')

    return {
      success: true,
      fullMonthBlob,
      partialMonthBlob,
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  }
}

/**
 * Helper to download a blob as a file
 */
function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// Export for use in App.tsx or browser console
export { testReceiptData, fullMonthReceipt, partialMonthReceipt }
