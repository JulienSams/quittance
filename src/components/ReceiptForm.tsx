import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { ConfigManager } from '@/components/ConfigManager'
import { saveConfig, loadConfig, deleteConfig } from '@/lib/config-storage'

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
      <div className="bg-white border border-stone-200 mb-32">
        <div className="p-8 sm:p-12 border-b border-stone-200">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-light tracking-tight text-stone-900 mb-3">
                Informations
              </h2>
              <p className="text-stone-600 font-light">
                Complétez les informations ci-dessous pour générer vos quittances
              </p>
            </div>
            <ConfigManager
              onSave={(name) => saveConfig(name, formData)}
              onLoad={(name) => {
                const data = loadConfig(name)
                if (data) {
                  // Reload form with loaded data
                  window.location.reload()
                  // Store the config name to load after reload
                  sessionStorage.setItem('quittance-load-config', name)
                }
              }}
              onDelete={(name) => deleteConfig(name)}
            />
          </div>
        </div>

      <Accordion type="single" collapsible defaultValue="proprietaire" className="divide-y divide-stone-200">
        {/* Section 1: Propriétaire */}
        <AccordionItem value="proprietaire" className="border-0">
          <AccordionTrigger className="px-8 sm:px-12 py-6 hover:bg-stone-50 transition-colors">
            <span className="text-lg font-light text-stone-900">Propriétaire</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 sm:px-12 py-8 bg-stone-50/30">
            <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="prop-nom">Nom *</Label>
                <Input
                  id="prop-nom"
                  name="family-name"
                  autoComplete="family-name"
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
                  name="given-name"
                  autoComplete="given-name"
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
                name="street-address"
                autoComplete="street-address"
                value={formData.proprietaire.adresse}
                onChange={(e) => updateField('proprietaire', 'adresse', e.target.value)}
                onBlur={() => handleBlur('proprietaire', 'adresse')}
                className={errors.proprietaire?.adresse ? 'border-destructive' : ''}
              />
              {errors.proprietaire?.adresse && (
                <p className="text-sm text-destructive mt-1">{errors.proprietaire.adresse}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="prop-cp">Code postal *</Label>
                <Input
                  id="prop-cp"
                  name="postal-code"
                  autoComplete="postal-code"
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
                  name="address-level2"
                  autoComplete="address-level2"
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
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 2: Locataire */}
        <AccordionItem value="locataire" className="border-0">
          <AccordionTrigger className="px-8 sm:px-12 py-6 hover:bg-stone-50 transition-colors">
            <span className="text-lg font-light text-stone-900">Locataire</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 sm:px-12 py-8 bg-stone-50/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <AccordionItem value="bien" className="border-0">
          <AccordionTrigger className="px-8 sm:px-12 py-6 hover:bg-stone-50 transition-colors">
            <span className="text-lg font-light text-stone-900">Bien loué</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 sm:px-12 py-8 bg-stone-50/30">
            <div className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 4: Loyer */}
        <AccordionItem value="loyer" className="border-0">
          <AccordionTrigger className="px-8 sm:px-12 py-6 hover:bg-stone-50 transition-colors">
            <span className="text-lg font-light text-stone-900">Loyer et charges</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 sm:px-12 py-8 bg-stone-50/30">
            <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="pt-2 text-lg font-light text-stone-900">
              Total: <span className="font-normal">{(formData.loyer.loyerHorsCharges + formData.loyer.charges).toFixed(2)} €</span>
            </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 5: Période de génération */}
        <AccordionItem value="periode" className="border-0">
          <AccordionTrigger className="px-8 sm:px-12 py-6 hover:bg-stone-50 transition-colors">
            <span className="text-lg font-light text-stone-900">Période de génération</span>
          </AccordionTrigger>
          <AccordionContent className="px-8 sm:px-12 py-8 bg-stone-50/30">
            <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="pt-4 text-sm text-stone-600 font-light">
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
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Batch Generation Section */}
      <div className="px-8 sm:px-12 py-8 border-t border-stone-200 bg-stone-50/30 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-light text-stone-900">Génération des documents</h3>
          <p className="text-sm text-stone-600 font-light">
            Téléchargez toutes vos quittances au format PDF
          </p>
        </div>

        <Button
          type="button"
          onClick={handleGenerateBatch}
          disabled={isGenerating || !formData.dateDebut || !formData.dateFin}
          className="w-full bg-stone-900 hover:bg-stone-800 text-white font-light transition-colors"
          size="lg"
        >
          {isGenerating ? 'Génération en cours...' : 'Générer les quittances'}
        </Button>

        {isGenerating && (
          <div className="bg-stone-100 p-4 rounded">
            <p className="text-sm text-stone-700 flex items-center gap-2 font-light">
              <Loader2 className="h-4 w-4 animate-spin" />
              Génération en cours... {progress.current}/{progress.total}
            </p>
          </div>
        )}

        {generationError && (
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <p className="text-sm text-red-700 font-light">
              {generationError}
            </p>
          </div>
        )}
      </div>
      </div>

      {/* Sticky save button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-stone-200 p-6 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <div className="flex items-center gap-2 text-stone-600 font-light">
                <Check className="h-4 w-4" />
                <span className="text-sm">
                  Données sauvegardées
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              disabled={isSaving}
              className="border-stone-300 hover:bg-stone-50 font-light"
            >
              Réinitialiser
            </Button>
            <Button
              onClick={save}
              disabled={isSaving}
              size="lg"
              className="bg-stone-900 hover:bg-stone-800 text-white font-light transition-colors"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
