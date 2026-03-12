# Générateur de Quittances de Loyer

## What This Is

Une application web frontend (React + shadcn) qui permet aux propriétaires de générer en masse des quittances de loyer conformes à la loi française pour locations meublées. L'utilisateur saisit les informations du bien et du locataire dans un formulaire, définit une période (dates de début et fin), et l'application génère automatiquement toutes les quittances mensuelles au format PDF dans un fichier ZIP, avec calcul prorata pour le dernier mois partiel.

## Core Value

Générer des quittances de loyer légalement conformes pour locations meublées en France, avec calcul automatique du prorata temporis pour les périodes partielles.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Formulaire de saisie des informations obligatoires (propriétaire, locataire, bien, loyer)
- [ ] Sélection d'une période de génération (date début - date fin)
- [ ] Génération automatique de toutes les quittances mensuelles entre les deux dates
- [ ] Calcul automatique du prorata pour le dernier mois si période partielle
- [ ] Conformité légale française pour locations meublées (mentions obligatoires)
- [ ] Décomposition loyer hors charges + charges (loi ALUR)
- [ ] Prévisualisation d'une quittance avant génération du lot complet
- [ ] Export en fichier ZIP contenant tous les PDFs
- [ ] Sauvegarde locale des informations (localStorage) pour réutilisation
- [ ] Interface responsive (desktop, tablette, mobile)
- [ ] Design professionnel avec shadcn/ui

### Out of Scope

- Authentification utilisateur — chaque propriétaire utilise son propre navigateur, données locales suffisent
- Gestion multi-utilisateurs avec comptes — pas de backend nécessaire
- Envoi automatique par email — uniquement téléchargement du ZIP
- Historique des générations précédentes — génération à la demande uniquement
- Locations vides (non meublées) — focus sur le meublé uniquement pour v1

## Context

**Contexte légal français:**
- Les quittances de loyer pour locations meublées doivent respecter des mentions obligatoires spécifiques
- La loi ALUR impose la décomposition loyer/charges
- Le calcul du prorata temporis pour mois partiel suit des règles spécifiques (nombre de jours réels)

**Stack technique:**
- Frontend uniquement (pas de backend)
- React avec TypeScript
- shadcn/ui pour les composants
- Génération PDF côté client (bibliothèque à définir pendant recherche)
- localStorage pour la persistance des données

**Usage attendu:**
- Plusieurs propriétaires peuvent utiliser l'app, mais chacun sur son propre navigateur
- Génération typique: 6-12 mois de quittances en une fois
- Cas d'usage: nouveau locataire, régularisation, changement de bail

## Constraints

- **Environnement**: Frontend uniquement — toute la logique doit s'exécuter côté client (pas de serveur)
- **Conformité légale**: Mentions obligatoires selon la législation française pour locations meublées
- **Stack**: React + shadcn/ui (imposé par l'utilisateur)
- **Format de sortie**: PDF haute qualité, téléchargeable, prêt à envoyer ou imprimer
- **Calcul prorata**: Doit être exact selon le nombre de jours réels dans le mois

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Frontend uniquement (pas de backend) | Simplicité, pas de gestion utilisateur, données locales | — Pending |
| localStorage pour la persistance | Évite le backend, données réutilisables entre sessions | — Pending |
| Focus locations meublées v1 | Règles légales spécifiques, scope plus clair | — Pending |
| Design professionnel responsive | Usage multi-device, crédibilité professionnelle | — Pending |

---
*Last updated: 2026-03-12 after initialization*
