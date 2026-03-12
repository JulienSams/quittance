import { TestPDF } from '@/components/TestPDF'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Générateur de Quittances de Loyer</h1>
          <p className="text-muted-foreground">
            Application de génération de quittances de loyer pour locations meublées en France
          </p>
        </div>

        <TestPDF />

        <p className="text-sm text-center text-muted-foreground">
          Phase 1 : Configuration technique terminée ✓
        </p>
      </div>
    </div>
  )
}

export default App
