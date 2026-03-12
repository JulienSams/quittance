# Quick Task 3: Historique des quittances générées

**Created:** 2026-03-12
**Status:** Ready for execution

## Task 1: Créer le système de stockage de l'historique

**Files:**
- `src/types/history.ts` (new)
- `src/lib/history-storage.ts` (new)

**Action:**
Créer la structure pour stocker l'historique des générations:
- Type `GenerationHistory` avec: id, date, propriétaire, locataire, période, nombre de quittances, blob ZIP
- Fonctions: `saveGenerationToHistory()`, `getHistory()`, `deleteHistoryItem()`, `clearHistory()`
- Stocker dans IndexedDB (pour les blobs ZIP volumineux)

**Verify:**
- [ ] Types définis correctement
- [ ] Build réussit

**Done:** [ ]

---

## Task 2: Créer le composant HistoryViewer

**Files:**
- `src/components/HistoryViewer.tsx` (new)

**Action:**
Créer un composant pour afficher l'historique:
- Liste des générations avec date, propriétaire, locataire, période
- Bouton "Télécharger" pour re-télécharger le ZIP
- Bouton "Supprimer" avec confirmation
- Badge avec nombre de quittances
- Design cohérent avec le reste (teal/emerald)
- Empty state si aucun historique

**Verify:**
- [ ] Composant s'affiche
- [ ] Liste l'historique correctement

**Done:** [ ]

---

## Task 3: Intégrer l'historique dans l'app

**Files:**
- `src/App.tsx` (modify - ajouter section historique)
- `src/components/ReceiptForm.tsx` (modify - sauver dans historique après génération)

**Action:**
- Ajouter section "Historique" sous le formulaire
- Sauvegarder automatiquement après chaque génération réussie
- Afficher HistoryViewer dans l'app

**Verify:**
- [ ] Historique se sauvegarde après génération
- [ ] Re-téléchargement fonctionne
- [ ] Suppression fonctionne

**Done:** [ ]
