import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useReceiptForm } from '@/hooks/useReceiptForm'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateReceiptBatch, generateZipFilename } from '@/lib/batch-generator'
import { validateBatchGeneration } from '@/lib/validation'
import { useState } from 'react'

export function ReceiptForm() {
  const { formData, errors, isSaving, saveSuccess, updateField, updateDateField, handleBlur, save, resetForm } = useReceiptForm()

  // Batch generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [generationError, setGenerationError] = useState<string | null>(null)

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ? Cette action ne peut pas être annulée.')) {
      resetForm()
    }
  }

  async function handleGenerateBatch() {
    // Reset state
    setGenerationError(null)
    setProgress({ current: 0, total: 0 })

    // Validate
    const validation = validateBatchGeneration(formData)
    if (!validation.valid) {
      setGenerationError(validation.errors.join('. '))
      return
    }

    // Generate
    setIsGenerating(true)
    const total = formData.monthlyReceipts?.length || 0
    setProgress({ current: 0, total })

    try {
      const zipBlob = await generateReceiptBatch(
        formData,
        (current, total) => setProgress({ current, total })
      )

      // Download
      const filename = generateZipFilename(formData)
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)

      setIsGenerating(false)
    } catch (err) {
      setGenerationError(
        err instanceof Error ? err.message : 'Erreur lors de la génération des quittances'
      )
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Card className="p-8 mb-24 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Informations de la quittance
        </h2>
        <p className="text-sm text-muted-foreground">
          Complétez les informations ci-dessous pour générer vos quittances
        </p>
      </div>

      <Accordion type="single" collapsible defaultValue="proprietaire" className="space-y-3">
        {/* Section 1: Propriétaire */}
        <AccordionItem value="proprietaire" className="border border-blue-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
          <AccordionTrigger className="px-4 hover:bg-blue-50/50">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">👤</span>
              <span>Propriétaire</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-md px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prop-nom">Nom *</Label>
                <Input
                  id="prop-nom"
                  value={formData.proprietaire.nom}
                  onChange={(e) => updateField('proprietaire', 'nom', e.target.value)}
                  onBlur={() => handleBlur('proprietaire', 'nom')}
                  className={errors.proprietaire?.nom ? 'border-destructive' : ''}
                />
                {errors.proprietaire?.nom && (
                  <p className="text-sm text-destructive mt-1">{errors.proprietaire.nom}</p>
                )}
              </div>
              <div>
                <Label htmlFor="prop-prenom">Prénom *</Label>
                <Input
                  id="prop-prenom"
                  value={formData.proprietaire.prenom}
                  onChange={(e) => updateField('proprietaire', 'prenom', e.target.value)}
                  onBlur={() => handleBlur('proprietaire', 'prenom')}
                  className={errors.proprietaire?.prenom ? 'border-destructive' : ''}
                />
                {errors.proprietaire?.prenom && (
                  <p className="text-sm text-destructive mt-1">{errors.proprietaire.prenom}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="prop-adresse">Adresse *</Label>
              <Input
                id="prop-adresse"
                value={formData.proprietaire.adresse}
                onChange={(e) => updateField('proprietaire', 'adresse', e.target.value)}
                onBlur={() => handleBlur('proprietaire', 'adresse')}
                className={errors.proprietaire?.adresse ? 'border-destructive' : ''}
              />
              {errors.proprietaire?.adresse && (
                <p className="text-sm text-destructive mt-1">{errors.proprietaire.adresse}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prop-cp">Code postal *</Label>
                <Input
                  id="prop-cp"
                  value={formData.proprietaire.codePostal}
                  onChange={(e) => updateField('proprietaire', 'codePostal', e.target.value)}
                  onBlur={() => handleBlur('proprietaire', 'codePostal')}
                  maxLength={5}
                  className={errors.proprietaire?.codePostal ? 'border-destructive' : ''}
                />
                {errors.proprietaire?.codePostal && (
                  <p className="text-sm text-destructive mt-1">{errors.proprietaire.codePostal}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="prop-ville">Ville *</Label>
                <Input
                  id="prop-ville"
                  value={formData.proprietaire.ville}
                  onChange={(e) => updateField('proprietaire', 'ville', e.target.value)}
                  onBlur={() => handleBlur('proprietaire', 'ville')}
                  className={errors.proprietaire?.ville ? 'border-destructive' : ''}
                />
                {errors.proprietaire?.ville && (
                  <p className="text-sm text-destructive mt-1">{errors.proprietaire.ville}</p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 2: Locataire */}
        <AccordionItem value="locataire" className="border border-green-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
          <AccordionTrigger className="px-4 hover:bg-green-50/50">
            <div className="flex items-center gap-2">
              <span className="text-green-600">🏠</span>
              <span>Locataire</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4 bg-gradient-to-br from-green-50/30 to-emerald-50/30 rounded-md px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loc-nom">Nom *</Label>
                <Input
                  id="loc-nom"
                  value={formData.locataire.nom}
                  onChange={(e) => updateField('locataire', 'nom', e.target.value)}
                  onBlur={() => handleBlur('locataire', 'nom')}
                  className={errors.locataire?.nom ? 'border-destructive' : ''}
                />
                {errors.locataire?.nom && (
                  <p className="text-sm text-destructive mt-1">{errors.locataire.nom}</p>
                )}
              </div>
              <div>
                <Label htmlFor="loc-prenom">Prénom *</Label>
                <Input
                  id="loc-prenom"
                  value={formData.locataire.prenom}
                  onChange={(e) => updateField('locataire', 'prenom', e.target.value)}
                  onBlur={() => handleBlur('locataire', 'prenom')}
                  className={errors.locataire?.prenom ? 'border-destructive' : ''}
                />
                {errors.locataire?.prenom && (
                  <p className="text-sm text-destructive mt-1">{errors.locataire.prenom}</p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 3: Bien */}
        <AccordionItem value="bien" className="border border-purple-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
          <AccordionTrigger className="px-4 hover:bg-purple-50/50">
            <div className="flex items-center gap-2">
              <span className="text-purple-600">🏢</span>
              <span>Bien loué</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4 bg-gradient-to-br from-purple-50/30 to-pink-50/30 rounded-md px-4">
            <div>
              <Label htmlFor="bien-adresse">Adresse *</Label>
              <Input
                id="bien-adresse"
                value={formData.bien.adresse}
                onChange={(e) => updateField('bien', 'adresse', e.target.value)}
                onBlur={() => handleBlur('bien', 'adresse')}
                className={errors.bien?.adresse ? 'border-destructive' : ''}
              />
              {errors.bien?.adresse && (
                <p className="text-sm text-destructive mt-1">{errors.bien.adresse}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bien-cp">Code postal *</Label>
                <Input
                  id="bien-cp"
                  value={formData.bien.codePostal}
                  onChange={(e) => updateField('bien', 'codePostal', e.target.value)}
                  onBlur={() => handleBlur('bien', 'codePostal')}
                  maxLength={5}
                  className={errors.bien?.codePostal ? 'border-destructive' : ''}
                />
                {errors.bien?.codePostal && (
                  <p className="text-sm text-destructive mt-1">{errors.bien.codePostal}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bien-ville">Ville *</Label>
                <Input
                  id="bien-ville"
                  value={formData.bien.ville}
                  onChange={(e) => updateField('bien', 'ville', e.target.value)}
                  onBlur={() => handleBlur('bien', 'ville')}
                  className={errors.bien?.ville ? 'border-destructive' : ''}
                />
                {errors.bien?.ville && (
                  <p className="text-sm text-destructive mt-1">{errors.bien.ville}</p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 4: Loyer */}
        <AccordionItem value="loyer" className="border border-amber-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
          <AccordionTrigger className="px-4 hover:bg-amber-50/50">
            <div className="flex items-center gap-2">
              <span className="text-amber-600">💰</span>
              <span>Loyer et charges</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4 bg-gradient-to-br from-amber-50/30 to-orange-50/30 rounded-md px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loyer-hc">Loyer hors charges (€) *</Label>
                <Input
                  id="loyer-hc"
                  type="number"
                  step="0.01"
                  value={formData.loyer.loyerHorsCharges}
                  onChange={(e) => updateField('loyer', 'loyerHorsCharges', parseFloat(e.target.value) || 0)}
                  onBlur={() => handleBlur('loyer', 'loyerHorsCharges')}
                  className={errors.loyer?.loyerHorsCharges ? 'border-destructive' : ''}
                />
                {errors.loyer?.loyerHorsCharges && (
                  <p className="text-sm text-destructive mt-1">{errors.loyer.loyerHorsCharges}</p>
                )}
              </div>
              <div>
                <Label htmlFor="loyer-charges">Charges (€) *</Label>
                <Input
                  id="loyer-charges"
                  type="number"
                  step="0.01"
                  value={formData.loyer.charges}
                  onChange={(e) => updateField('loyer', 'charges', parseFloat(e.target.value) || 0)}
                  onBlur={() => handleBlur('loyer', 'charges')}
                  className={errors.loyer?.charges ? 'border-destructive' : ''}
                />
                {errors.loyer?.charges && (
                  <p className="text-sm text-destructive mt-1">{errors.loyer.charges}</p>
                )}
              </div>
            </div>

            <div className="pt-2 text-lg font-semibold">
              Total: {(formData.loyer.loyerHorsCharges + formData.loyer.charges).toFixed(2)} €
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 5: Période de génération */}
        <AccordionItem value="periode" className="border border-teal-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
          <AccordionTrigger className="px-4 hover:bg-teal-50/50">
            <div className="flex items-center gap-2">
              <span className="text-teal-600">📅</span>
              <span>Période de génération</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4 bg-gradient-to-br from-teal-50/30 to-cyan-50/30 rounded-md px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date-debut">Date de début *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-debut"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateDebut && "text-muted-foreground",
                        errors.dateRange && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateDebut ? (
                        format(formData.dateDebut, 'd MMMM yyyy', { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateDebut}
                      onSelect={(date) => updateDateField('dateDebut', date)}
                      locale={fr}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateRange && (
                  <p className="text-sm text-destructive mt-1">{errors.dateRange}</p>
                )}
              </div>

              <div>
                <Label htmlFor="date-fin">Date de fin *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-fin"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateFin && "text-muted-foreground",
                        errors.dateRange && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateFin ? (
                        format(formData.dateFin, 'd MMMM yyyy', { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateFin}
                      onSelect={(date) => updateDateField('dateFin', date)}
                      locale={fr}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {formData.monthlyReceipts && formData.monthlyReceipts.length > 0 && (
              <div className="pt-4 text-sm text-muted-foreground">
                ✓ {formData.monthlyReceipts.length} quittance{formData.monthlyReceipts.length > 1 ? 's' : ''} {formData.monthlyReceipts.length > 1 ? 'seront générées' : 'sera générée'}
                {(() => {
                  const partial = formData.monthlyReceipts.filter(r => r.period.isPartial).length
                  const full = formData.monthlyReceipts.length - partial
                  if (partial > 0 && full > 0) {
                    return ` (${full} mois complet${full > 1 ? 's' : ''} + ${partial} mois partiel${partial > 1 ? 's' : ''})`
                  }
                  return ''
                })()}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Batch Generation Section */}
      <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="font-semibold text-blue-900">Génération des documents</h3>
        </div>
        <Button
          type="button"
          onClick={handleGenerateBatch}
          disabled={isGenerating || !formData.dateDebut || !formData.dateFin}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
          size="lg"
        >
          {isGenerating ? 'Génération en cours...' : '📄 Générer les quittances'}
        </Button>

        {isGenerating && (
          <div className="bg-blue-100/50 backdrop-blur-sm p-3 rounded-lg">
            <p className="text-sm text-blue-900 flex items-center gap-2 font-medium">
              <Loader2 className="h-4 w-4 animate-spin" />
              Génération en cours... {progress.current}/{progress.total}
            </p>
          </div>
        )}

        {generationError && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className="text-sm text-red-700 font-medium">
              ⚠️ {generationError}
            </p>
          </div>
        )}
      </div>
      </Card>

      {/* Sticky save button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-blue-100 shadow-2xl p-4 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Données sauvegardées
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              disabled={isSaving}
              className="border-slate-300 hover:bg-slate-50"
            >
              🔄 Réinitialiser
            </Button>
            <Button
              onClick={save}
              disabled={isSaving}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isSaving ? '💾 Enregistrement...' : '💾 Enregistrer'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
