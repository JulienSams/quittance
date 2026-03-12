import { ReceiptForm } from '@/components/ReceiptForm'

function App() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Générateur de Quittances de Loyer</h1>
          <p className="text-muted-foreground">
            Application de génération de quittances de loyer pour locations meublées en France
          </p>
        </div>

        <ReceiptForm />

        <p className="text-sm text-center text-muted-foreground">
          Phase 2 : Formulaire de saisie
        </p>
      </div>
    </div>
  )
}

export default App
