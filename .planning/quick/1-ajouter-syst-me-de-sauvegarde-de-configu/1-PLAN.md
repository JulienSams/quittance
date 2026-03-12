# Quick Task 1: Système de sauvegarde de configurations multiples

**Created:** 2026-03-12
**Status:** Ready for execution

## Task 1: Créer le module de gestion des configurations

**Files:**
- `src/lib/config-storage.ts` (new)
- `src/types/config.ts` (new)

**Action:**
Créer un module pour gérer les configurations multiples:
- Interface `SavedConfig` avec nom, date, et données
- Fonctions `saveConfig()`, `loadConfig()`, `deleteConfig()`, `listConfigs()`
- Stocker dans localStorage avec clé par nom
- Format: `quittance-config-{nom}`

**Verify:**
- [ ] TypeScript compile sans erreurs
- [ ] Fonctions exportées correctement

**Done:** [ ]

---

## Task 2: Ajouter l'UI de gestion des configurations

**Files:**
- `src/components/ConfigManager.tsx` (new)
- `src/components/ReceiptForm.tsx` (modify - intégrer ConfigManager)

**Action:**
Créer un composant ConfigManager avec:
- Dialog pour sauvegarder (input nom + bouton)
- Liste des configurations avec boutons charger/supprimer
- Confirmation avant suppression
- Intégrer dans ReceiptForm en haut du formulaire

**Verify:**
- [ ] UI s'affiche correctement
- [ ] Dialog de sauvegarde fonctionne
- [ ] Liste affiche les configs
- [ ] Charger remplit le formulaire

**Done:** [ ]

---

## Task 3: Intégrer avec useReceiptForm

**Files:**
- `src/hooks/useReceiptForm.ts` (modify)

**Action:**
Ajouter les fonctions au hook:
- `saveConfigAs(name: string)` - sauvegarde avec nom
- `loadConfigByName(name: string)` - charge config
- `getAvailableConfigs()` - liste configs
- `deleteConfig(name: string)` - supprime

**Verify:**
- [ ] Hook expose nouvelles fonctions
- [ ] Sauvegarde/chargement fonctionne
- [ ] Données correctement sérialisées

**Done:** [ ]
