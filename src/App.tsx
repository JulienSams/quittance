import { ReceiptForm } from '@/components/ReceiptForm'
import { Button } from '@/components/ui/button'
import { testPDFGeneration } from '@/test-receipt-pdf'

function App() {
  const handleTestPDF = async () => {
    try {
      await testPDFGeneration()
      alert('PDFs de test générés ! Vérifiez vos téléchargements.')
    } catch (error) {
      console.error('Erreur lors de la génération des PDFs de test:', error)
      alert('Erreur lors de la génération. Voir la console pour les détails.')
    }
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Générateur de Quittances de Loyer</h1>
          <p className="text-muted-foreground">
            Application de génération de quittances de loyer pour locations meublées en France
          </p>
        </div>

        <ReceiptForm />

        <div className="text-center space-y-4">
          <Button onClick={handleTestPDF} variant="outline" size="sm">
            🧪 Tester la génération PDF (Phase 4)
          </Button>
          <p className="text-sm text-muted-foreground">Phase 2-4 : Formulaire et génération PDF</p>
        </div>
      </div>
    </div>
  )
}

export default App
