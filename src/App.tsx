import { ReceiptForm } from '@/components/ReceiptForm'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/20">
      {/* Hero Section - Modern & Colorful */}
      <section className="relative bg-gradient-to-r from-blue-600 to-violet-600 border-b border-blue-700/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGgtMnYtMmgydjJ6bTAgNGgtMnYtMmgydjJ6bS00IDBoLTJ2LTJoMnYyem0tNCAwSDI2di0yaDJ2MnptLTQgMGgtMnYtMmgydjJ6bS00IDBoLTJ2LTJoMnYyem0tNCAwaDJ2MmgtMnYtMnptMCA0aDJ2MmgtMnYtMnptMCA0aDJ2MmgtMnYtMnptMCA0aDJ2MmgtMnYtMnptMC00aDJ2MmgtMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative max-w-5xl mx-auto px-6 sm:px-12 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white drop-shadow-lg">
              Générateur de Quittances
            </h1>
            <p className="text-lg sm:text-xl text-blue-50 font-light leading-relaxed max-w-2xl mx-auto">
              Créez des quittances de loyer professionnelles et conformes à la législation française
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
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
