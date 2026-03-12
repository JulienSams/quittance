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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-8 shadow-lg">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Générateur de Quittances</h1>
          </div>
          <p className="text-blue-100 text-sm sm:text-base">
            Créez vos quittances de loyer conformes à la législation française en quelques clics
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
        <ReceiptForm />
      </div>
    </div>
  )
}

export default App
