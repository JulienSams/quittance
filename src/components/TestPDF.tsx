import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TestPDFDocument } from '@/lib/pdf-generator'
import '@/lib/pdf-fonts' // Import to register fonts

export function TestPDF() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      // Generate PDF blob
      const blob = await pdf(<TestPDFDocument />).toBlob()

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `test-quittance-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Erreur lors de la génération du PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test de génération PDF (Phase 1)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Ce test valide que @react-pdf/renderer fonctionne correctement avec :
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Les caractères français (é, è, à, ô, ç, œ, etc.)</li>
          <li>Les polices personnalisées (Inter)</li>
          <li>Les différents styles de texte (gras, tailles variées)</li>
          <li>Les structures de mise en page (bordures, tableaux)</li>
        </ul>
        <Button onClick={handleGeneratePDF} disabled={isGenerating} className="w-full">
          {isGenerating ? 'Génération en cours...' : 'Générer le PDF de test'}
        </Button>
      </CardContent>
    </Card>
  )
}
