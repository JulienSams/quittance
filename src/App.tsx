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
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Hero Section - Style Squarespace */}
      <section className="relative bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-stone-900">
              Générateur de Quittances
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
              Créez des quittances de loyer professionnelles et conformes à la législation française
            </p>
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 text-sm text-stone-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Conforme aux locations meublées</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-20">
        <ReceiptForm />
      </div>
    </div>
  )
}

export default App
