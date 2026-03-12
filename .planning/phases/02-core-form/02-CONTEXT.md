# Phase 2: Core Form & Data Model - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the input form for all required receipt information — landlord details, tenant details, property info, and rental amounts. Form uses shadcn/ui components with accordion layout, validates input, and persists data to localStorage with explicit save button. This establishes the data collection layer that feeds into receipt generation in later phases.

</domain>

<decisions>
## Implementation Decisions

### Form Layout & Organization
- Accordion/collapsible sections for vertical space efficiency (especially mobile)
- 4 sections: Propriétaire, Locataire, Bien, Loyer — logical grouping by entity type
- First section (Propriétaire) open by default, others closed — guides top-to-bottom flow
- Would need to add Accordion component from shadcn/ui (not yet installed)

### Data Persistence Strategy
- Explicit save button approach — user clicks "Enregistrer" to persist to localStorage
- Save button fixed at bottom of viewport (sticky) — always visible while scrolling through accordion
- Auto-load saved data silently on page load — seamless continuation without prompts
- User has clear control over when data is committed

### Required vs Optional Fields
- Required fields marked with asterisk (*) after label — standard convention
- Claude will research French legal requirements for "quittance de loyer location meublée" during planning to determine which fields are mandatory
- Claude will determine specific field list based on French receipt requirements and typical use cases

### Field Validation Approach
- Validate on blur (when user leaves field) + on submit — immediate feedback without being intrusive
- Display errors inline below invalid field — contextual, easy to fix
- Claude will research and implement French-specific validation rules during planning (postal codes, SIREN format, amount formats, etc.)

### Claude's Discretion
- Specific field list for each section (beyond obvious names/addresses/amounts)
- French-specific validation rules (postal code format, SIREN, amount formatting)
- Validation error message wording (tone and language)
- Choice of form validation library (react-hook-form, Zod, or other)
- Exact accordion animation/transition behavior
- Reset/clear functionality placement and confirmation flow
- How to handle localStorage quota exceeded scenarios

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Button` component (src/components/ui/button.tsx) — default/secondary/outline variants available for save/reset actions
- `Card` component (src/components/ui/card.tsx) with CardHeader/CardTitle/CardContent — can be used within accordion items for additional structure if needed
- `cn()` utility (src/lib/utils.ts) — for className merging with Tailwind
- Tailwind CSS configured — responsive design utilities available

### Established Patterns
- shadcn/ui component architecture — components installed on-demand via CLI
- TypeScript strict mode — type safety for data models
- React functional components with hooks — state management via useState/useEffect

### Integration Points
- Need to add Accordion component from shadcn/ui (not yet installed)
- Need to add Input, Label, and possibly other form components from shadcn
- TypeScript types/interfaces will define data model for receipt generation
- localStorage API for persistence — need error handling for quota exceeded
- Form data structure must match PDF generation requirements (Phase 4)

</code_context>

<specifics>
## Specific Ideas

- The accordion approach prioritizes mobile experience while keeping desktop usable
- Sticky save button ensures users can save from anywhere in the form without scrolling
- Silent auto-load makes returning to the form feel seamless — data is just there
- French legal compliance is critical — validation rules must match official requirements

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-core-form*
*Context gathered: 2026-03-12*
