import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { ReceiptData, MonthlyReceipt } from '@/types/receipt'
import { FONT_FAMILY } from '@/lib/pdf-fonts'
import { formatAmount, LEGAL_MENTIONS } from '@/lib/constants/french-legal'
import { getDaysOccupied, getDaysInMonth } from '@/lib/date-utils'

// Styles for the PDF receipt
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: FONT_FAMILY,
    fontSize: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'center',
    color: '#1e3a8a',
    marginBottom: 10,
  },
  receiptNumber: {
    fontSize: 10,
    position: 'absolute',
    top: 40,
    right: 40,
    color: '#374151',
  },
  period: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    color: '#374151',
  },
  section: {
    marginBottom: 15,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: 700,
    color: '#1e3a8a',
    marginBottom: 6,
  },
  text: {
    fontSize: 10,
    marginBottom: 4,
    color: '#1f2937',
  },
  table: {
    border: '1pt solid #1e3a8a',
    marginTop: 15,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e3a8a',
    borderBottom: '1pt solid #1e3a8a',
  },
  tableHeaderCell: {
    padding: 8,
    flex: 1,
    color: '#ffffff',
    fontWeight: 700,
    fontSize: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #d1d5db',
  },
  tableRowLast: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 8,
    flex: 1,
    fontSize: 10,
    borderRight: '1pt solid #d1d5db',
  },
  tableCellLast: {
    padding: 8,
    flex: 1,
    fontSize: 10,
  },
  tableCellBold: {
    padding: 8,
    flex: 1,
    fontSize: 10,
    fontWeight: 700,
    borderRight: '1pt solid #d1d5db',
  },
  prorataNote: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#6b7280',
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#6b7280',
  },
  footerText: {
    marginBottom: 3,
    lineHeight: 1.4,
  },
  footerDate: {
    marginTop: 10,
    fontSize: 8,
    color: '#9ca3af',
  },
})

interface ReceiptPDFProps {
  receiptData: ReceiptData
  monthlyReceipt: MonthlyReceipt
}

export const ReceiptPDF = ({ receiptData, monthlyReceipt }: ReceiptPDFProps) => {
  const { proprietaire, locataire, bien } = receiptData
  const { period, loyerHorsCharges, charges, total } = monthlyReceipt

  // Generate receipt number in YYYY-MM-001 format
  const receiptNumber = `${period.year}-${String(period.month + 1).padStart(2, '0')}-001`

  // Format period display
  const monthName = period.startDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const periodText = period.isPartial
    ? `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} (${period.startDate.toLocaleDateString('fr-FR')} au ${period.endDate.toLocaleDateString('fr-FR')})`
    : monthName.charAt(0).toUpperCase() + monthName.slice(1)

  // Calculate prorata details if partial month
  const prorataNote = period.isPartial
    ? `*Montant proratisé : ${getDaysOccupied(period.startDate, period.endDate)} jours sur ${getDaysInMonth(period.year, period.month)}`
    : null

  // Generation date
  const generationDate = new Date().toLocaleDateString('fr-FR')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Receipt Number - Top Right */}
        <Text style={styles.receiptNumber}>N° {receiptNumber}</Text>

        {/* Title */}
        <Text style={styles.title}>QUITTANCE DE LOYER</Text>

        {/* Period */}
        <Text style={styles.period}>Période : {periodText}</Text>

        {/* Landlord and Tenant - Two Columns */}
        <View style={styles.twoColumn}>
          {/* Landlord Column */}
          <View style={styles.column}>
            <Text style={styles.label}>PROPRIÉTAIRE</Text>
            <Text style={styles.text}>
              {proprietaire.prenom} {proprietaire.nom}
            </Text>
            <Text style={styles.text}>{proprietaire.adresse}</Text>
            <Text style={styles.text}>
              {proprietaire.codePostal} {proprietaire.ville}
            </Text>
            {proprietaire.telephone && <Text style={styles.text}>{proprietaire.telephone}</Text>}
            {proprietaire.email && <Text style={styles.text}>{proprietaire.email}</Text>}
          </View>

          {/* Tenant Column */}
          <View style={styles.column}>
            <Text style={styles.label}>LOCATAIRE</Text>
            <Text style={styles.text}>
              {locataire.prenom} {locataire.nom}
            </Text>
            {locataire.telephone && <Text style={styles.text}>{locataire.telephone}</Text>}
            {locataire.email && <Text style={styles.text}>{locataire.email}</Text>}
          </View>
        </View>

        {/* Property Section */}
        <View style={styles.section}>
          <Text style={styles.label}>BIEN CONCERNÉ</Text>
          <Text style={styles.text}>{bien.adresse}</Text>
          {bien.complement && <Text style={styles.text}>{bien.complement}</Text>}
          <Text style={styles.text}>
            {bien.codePostal} {bien.ville}
          </Text>
          {bien.typeBien && <Text style={styles.text}>{bien.typeBien}</Text>}
        </View>

        {/* Rent Breakdown Table */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Description</Text>
            <Text style={styles.tableHeaderCell}>Montant</Text>
          </View>

          {/* Rent Row */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Loyer hors charges</Text>
            <Text style={styles.tableCellLast}>{formatAmount(loyerHorsCharges)}</Text>
          </View>

          {/* Charges Row */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Charges forfaitaires</Text>
            <Text style={styles.tableCellLast}>{formatAmount(charges)}</Text>
          </View>

          {/* Total Row */}
          <View style={styles.tableRowLast}>
            <Text style={styles.tableCellBold}>TOTAL</Text>
            <Text style={[styles.tableCellLast, { fontWeight: 700 }]}>{formatAmount(total)}</Text>
          </View>
        </View>

        {/* Prorata Note (if partial month) */}
        {prorataNote && <Text style={styles.prorataNote}>{prorataNote}</Text>}

        {/* Footer with Legal Mentions */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{LEGAL_MENTIONS.ALUR_MENTION}</Text>
          <Text style={styles.footerText}>{LEGAL_MENTIONS.RECEIPT_PURPOSE}</Text>
          <Text style={styles.footerText}>{LEGAL_MENTIONS.PAYMENT_CONFIRMATION}</Text>
          <Text style={styles.footerDate}>Document généré le {generationDate}</Text>
        </View>
      </Page>
    </Document>
  )
}
