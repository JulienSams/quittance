# Phase 3: Date Range & Receipt Logic - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement date range selection and monthly receipt generation logic. Users select start and end dates via calendar pickers, the app calculates which months fall in that range, applies prorata calculations for partial first/last months based on real days, and prepares the month-by-month receipt data structure. This establishes the temporal logic layer that drives batch PDF generation in later phases.

</domain>

<decisions>
## Implementation Decisions

### Date Picker UI & Library
- Use shadcn Calendar component (wraps react-day-picker) with French locale
- Two separate date pickers: "Date de début" and "Date de fin" (not a single range picker)
- No hard limits on date ranges — users can select any range, trust their judgment
- Date range section appears after Loyer section in the accordion (logical flow: info first, then period)
- Install shadcn's calendar and popover components (not yet in project)

### Prorata Calculation Logic
- Use real days in month (31 for January, 28/29 for February, 30 for April, etc.) — not standardized 30-day months
- Apply prorata to BOTH first AND last month if partial (e.g., starts on 15th, ends on 20th)
- Formula: `(amount / daysInMonth) × daysOccupied`
- Round to nearest cent using standard rounding (0.5 and above rounds up)
- Apply prorata to both rent AND charges — proportional reduction to total amount

### Month Generation Logic
- Generate list of all months between start and end dates (inclusive)
- Detect partial first month: start date is not the 1st of the month
- Detect partial last month: end date is not the last day of the month
- Each month needs: year, month number, amount (full or prorated), date range covered

### Claude's Discretion
- Whether to show a month-by-month preview before PDF generation (Phase 5 scope)
- Exact validation error messages for invalid date ranges
- How to handle same-month periods (start = end month) — treat as single partial month or full month
- Maximum range warning threshold (if any)
- Edge case handling for year boundaries and leap years
- Data structure format for storing generated months array

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ReceiptData` type (src/types/receipt.ts) — already has `dateDebut?: Date` and `dateFin?: Date` fields
- `useReceiptForm` hook (src/hooks/useReceiptForm.ts) — manages form state, can extend for date handling
- `Input`, `Label`, `Button` components from shadcn/ui — for form controls
- `Accordion` component — established pattern for form sections (Phase 2)
- `validation.ts` utilities — can add date validation functions

### Established Patterns
- Accordion sections for form organization (Propriétaire, Locataire, Bien, Loyer already exist)
- Inline validation on blur + submit pattern
- localStorage persistence with explicit save button
- TypeScript strict mode — need proper Date handling types

### Integration Points
- Need to install shadcn calendar and popover components
- `ReceiptData` type already prepared for dates — just need to populate them
- Month generation output will feed into Phase 4 (PDF generation) and Phase 5 (batch export)
- Date validation should integrate with existing `validation.ts` pattern
- French locale configuration for date formatting and calendar display

</code_context>

<specifics>
## Specific Ideas

- Real days calculation is critical for legal compliance — French rental law requires accurate prorata
- Both rent and charges get prorated together — simplifies the calculation and is fair to both parties
- Two separate pickers (start/end) is clearer than a range picker for this use case
- Trusting users with no hard limits assumes they know their rental situation best
- Placement after Loyer section follows natural flow: collect info, then define generation period

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-date-range-logic*
*Context gathered: 2026-03-12*
