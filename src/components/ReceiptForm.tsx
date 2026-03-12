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
import { useReceiptForm } from '@/hooks/useReceiptForm'

export function ReceiptForm() {
  const { formData, errors, isSaving, saveSuccess, updateField, handleBlur, save, resetForm } = useReceiptForm()

  return (
    <>
      <Card className="p-6 mb-24">
      <h2 className="text-2xl font-bold mb-6">
        Informations de la quittance
      </h2>

      <Accordion type="single" collapsible defaultValue="proprietaire">
        {/* Section 1: Propriétaire */}
        <AccordionItem value="proprietaire">
          <AccordionTrigger>Propriétaire</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prop-nom">Nom *</Label>
                <Input
                  id="prop-nom"
                  value={formData.proprietaire.nom}
                  onChange={(e) => updateField('proprietaire', 'nom', e.target.value)}
                  onBlur={() => handleBlur('proprietaire', 'nom')}
                  className={errors.proprietaire?.nom ? 'border-red-600' : ''}
                />
                {errors.proprietaire?.nom && (
                  <p className="text-sm text-red-600 mt-1">{errors.proprietaire.nom}</p>
                )}
              </div>
              <div>
                <Label htmlFor="prop-prenom">Prénom *</Label>
                <Input
                  id="prop-prenom"
                  value={formData.proprietaire.prenom}
                  onChange={(e) => updateField('proprietaire', 'prenom', e.target.value)}
                  onBlur={() => handleBlur('proprietaire', 'prenom')}
                  className={errors.proprietaire?.prenom ? 'border-red-600' : ''}
                />
                {errors.proprietaire?.prenom && (
                  <p className="text-sm text-red-600 mt-1">{errors.proprietaire.prenom}</p>
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
                className={errors.proprietaire?.adresse ? 'border-red-600' : ''}
              />
              {errors.proprietaire?.adresse && (
                <p className="text-sm text-red-600 mt-1">{errors.proprietaire.adresse}</p>
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
                  className={errors.proprietaire?.codePostal ? 'border-red-600' : ''}
                />
                {errors.proprietaire?.codePostal && (
                  <p className="text-sm text-red-600 mt-1">{errors.proprietaire.codePostal}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="prop-ville">Ville *</Label>
                <Input
                  id="prop-ville"
                  value={formData.proprietaire.ville}
                  onChange={(e) => updateField('proprietaire', 'ville', e.target.value)}
                  onBlur={() => handleBlur('proprietaire', 'ville')}
                  className={errors.proprietaire?.ville ? 'border-red-600' : ''}
                />
                {errors.proprietaire?.ville && (
                  <p className="text-sm text-red-600 mt-1">{errors.proprietaire.ville}</p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 2: Locataire */}
        <AccordionItem value="locataire">
          <AccordionTrigger>Locataire</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loc-nom">Nom *</Label>
                <Input
                  id="loc-nom"
                  value={formData.locataire.nom}
                  onChange={(e) => updateField('locataire', 'nom', e.target.value)}
                  onBlur={() => handleBlur('locataire', 'nom')}
                  className={errors.locataire?.nom ? 'border-red-600' : ''}
                />
                {errors.locataire?.nom && (
                  <p className="text-sm text-red-600 mt-1">{errors.locataire.nom}</p>
                )}
              </div>
              <div>
                <Label htmlFor="loc-prenom">Prénom *</Label>
                <Input
                  id="loc-prenom"
                  value={formData.locataire.prenom}
                  onChange={(e) => updateField('locataire', 'prenom', e.target.value)}
                  onBlur={() => handleBlur('locataire', 'prenom')}
                  className={errors.locataire?.prenom ? 'border-red-600' : ''}
                />
                {errors.locataire?.prenom && (
                  <p className="text-sm text-red-600 mt-1">{errors.locataire.prenom}</p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 3: Bien */}
        <AccordionItem value="bien">
          <AccordionTrigger>Bien loué</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div>
              <Label htmlFor="bien-adresse">Adresse *</Label>
              <Input
                id="bien-adresse"
                value={formData.bien.adresse}
                onChange={(e) => updateField('bien', 'adresse', e.target.value)}
                onBlur={() => handleBlur('bien', 'adresse')}
                className={errors.bien?.adresse ? 'border-red-600' : ''}
              />
              {errors.bien?.adresse && (
                <p className="text-sm text-red-600 mt-1">{errors.bien.adresse}</p>
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
                  className={errors.bien?.codePostal ? 'border-red-600' : ''}
                />
                {errors.bien?.codePostal && (
                  <p className="text-sm text-red-600 mt-1">{errors.bien.codePostal}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bien-ville">Ville *</Label>
                <Input
                  id="bien-ville"
                  value={formData.bien.ville}
                  onChange={(e) => updateField('bien', 'ville', e.target.value)}
                  onBlur={() => handleBlur('bien', 'ville')}
                  className={errors.bien?.ville ? 'border-red-600' : ''}
                />
                {errors.bien?.ville && (
                  <p className="text-sm text-red-600 mt-1">{errors.bien.ville}</p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 4: Loyer */}
        <AccordionItem value="loyer">
          <AccordionTrigger>Loyer et charges</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
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
                  className={errors.loyer?.loyerHorsCharges ? 'border-red-600' : ''}
                />
                {errors.loyer?.loyerHorsCharges && (
                  <p className="text-sm text-red-600 mt-1">{errors.loyer.loyerHorsCharges}</p>
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
                  className={errors.loyer?.charges ? 'border-red-600' : ''}
                />
                {errors.loyer?.charges && (
                  <p className="text-sm text-red-600 mt-1">{errors.loyer.charges}</p>
                )}
              </div>
            </div>

            <div className="pt-2 text-lg font-semibold">
              Total: {(formData.loyer.loyerHorsCharges + formData.loyer.charges).toFixed(2)} €
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      </Card>

      {/* Sticky save button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-sm text-green-600 font-medium">
                ✓ Données sauvegardées
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={resetForm}
              variant="outline"
              size="lg"
              disabled={isSaving}
            >
              Réinitialiser
            </Button>
            <Button
              onClick={save}
              disabled={isSaving}
              size="lg"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
