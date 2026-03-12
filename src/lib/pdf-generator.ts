import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { FONT_FAMILY } from './pdf-fonts'

// Styles for the test PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: FONT_FAMILY,
    fontSize: 11,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 700,
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    marginBottom: 8,
    lineHeight: 1.5,
  },
  boldText: {
    fontWeight: 700,
  },
  section: {
    marginBottom: 15,
  },
  box: {
    border: '1pt solid #333',
    padding: 15,
    marginBottom: 15,
  },
  table: {
    border: '1pt solid #333',
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #333',
  },
  tableCell: {
    padding: 8,
    flex: 1,
    borderRight: '1pt solid #333',
  },
  tableCellLast: {
    padding: 8,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    fontSize: 9,
    color: '#666',
  },
})

export const TestPDFDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Title */}
      <Text style={styles.title}>Test de Génération PDF</Text>

      {/* Section 1: French characters test */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>1. Test des caractères français</Text>
        <Text style={styles.text}>
          Voici un test complet avec tous les accents français :
        </Text>
        <Text style={styles.text}>
          • À, à - Â, â - Ä, ä (a avec accents)
        </Text>
        <Text style={styles.text}>
          • É, é - È, è - Ê, ê - Ë, ë (e avec accents)
        </Text>
        <Text style={styles.text}>
          • Î, î - Ï, ï (i avec accents)
        </Text>
        <Text style={styles.text}>
          • Ô, ô - Ö, ö (o avec accents)
        </Text>
        <Text style={styles.text}>
          • Ù, ù - Û, û - Ü, ü (u avec accents)
        </Text>
        <Text style={styles.text}>• Ç, ç (c cédille)</Text>
        <Text style={styles.text}>• Œ, œ (ligature)</Text>
      </View>

      {/* Section 2: Example text with formatting */}
      <View style={styles.box}>
        <Text style={[styles.text, styles.boldText]}>
          Quittance de loyer - Location meublée
        </Text>
        <Text style={styles.text}>Propriétaire : François Dupré</Text>
        <Text style={styles.text}>Locataire : Éléonore Beauséjour</Text>
        <Text style={styles.text}>Adresse : 12 rue de l'Église, 75001 Paris</Text>
        <Text style={styles.text}>Période : Février 2026</Text>
      </View>

      {/* Section 3: Table-like structure */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>2. Structure tabulaire</Text>
        <View style={styles.table}>
          {/* Header row */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.boldText}>Description</Text>
            </View>
            <View style={styles.tableCellLast}>
              <Text style={styles.boldText}>Montant (€)</Text>
            </View>
          </View>
          {/* Data rows */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Loyer hors charges</Text>
            </View>
            <View style={styles.tableCellLast}>
              <Text>850,00 €</Text>
            </View>
          </View>
          <View style={[styles.tableRow, { borderBottom: 'none' }]}>
            <View style={styles.tableCell}>
              <Text>Charges forfaitaires</Text>
            </View>
            <View style={styles.tableCellLast}>
              <Text>150,00 €</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Section 4: Different text sizes */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>3. Tailles et styles variés</Text>
        <Text style={{ fontSize: 14, marginBottom: 5 }}>Texte de taille 14pt</Text>
        <Text style={{ fontSize: 12, marginBottom: 5 }}>Texte de taille 12pt</Text>
        <Text style={{ fontSize: 10, marginBottom: 5 }}>Texte de taille 10pt</Text>
        <Text style={{ fontSize: 11, fontWeight: 700, marginBottom: 5 }}>Texte en gras</Text>
        <Text style={{ fontSize: 11, marginBottom: 5 }}>Texte normal</Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Document généré le {new Date().toLocaleDateString('fr-FR')} - Test Phase 1
      </Text>
    </Page>
  </Document>
)
