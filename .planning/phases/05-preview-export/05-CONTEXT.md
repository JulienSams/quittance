# Phase 5: Preview & Batch Export - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Add batch PDF export functionality to generate all receipts in the selected date range and download them as a ZIP file. Users click a generate button, see progress during generation, and automatically receive a ZIP download containing all PDFs. This establishes the batch export layer that completes the MVP user flow: fill form → select dates → download all receipts.

</domain>

<decisions>
## Implementation Decisions

### Preview Functionality
- **No preview** — Skip preview modal/panel entirely
- Go straight from form to batch generation
- Simplifies phase by removing preview UI complexity

### Batch Generation Flow
- **Progress indicator** — Show "Generating... 5/12 receipts" or similar during generation
- Provides user feedback, especially important for large batches (12+ months)
- **Fail entire batch on error** — If any single receipt fails to generate, stop and show error
- Prevents incomplete or corrupted ZIP files
- User can fix the issue and retry with confidence

### ZIP File Structure
- **PDF filenames**: `quittance_2026-02.pdf` (date-based format: `quittance_YYYY-MM.pdf`)
- Natural chronological sorting when viewing files
- Easy to identify which month each receipt covers
- **ZIP filename**: `quittances_[tenantname]_YYYY-MM_YYYY-MM.zip` (tenant name + date range)
- Example: `quittances_dupont_2026-01_2026-12.zip`
- Helps landlords managing multiple properties identify which tenant's receipts
- **Flat structure** — All PDFs directly in ZIP root, no folders
- Simple extraction, works well with date-based filenames

### Download Trigger & UX
- **Button placement**: After date pickers section in accordion
- Natural top-to-bottom flow: fill form → select dates → generate
- Follows established accordion pattern from Phase 2
- **Auto-download after generation** — Single button click triggers generation, then automatically downloads ZIP when ready
- Seamless single-action experience
- Browser handles download prompt automatically
- **Full validation before generation** — Validate all required form fields and dates before starting generation
- Show clear error messages if anything is missing or invalid
- Prevents wasted generation attempts and mid-generation failures

### Claude's Discretion
- Exact progress indicator UI (text vs progress bar vs percentage)
- Specific error message wording for validation failures
- How to format tenant name in ZIP filename (lowercase, spaces to underscores, etc.)
- Button label text ("Générer les quittances", "Télécharger", or other)
- Button styling (primary vs accent color)
- Success message after download starts
- How to handle very long tenant names in ZIP filename (truncation strategy)
- ZIP library choice (JSZip is common but research may find alternatives)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `generateReceiptPDF()` function (src/lib/receipt-generator.tsx) — Generates single receipt PDF blob
- `ReceiptPDF` component (src/components/ReceiptPDF.tsx) — Full receipt rendering logic
- `monthlyReceipts` array in `ReceiptData` type — Already calculated with prorata from Phase 3
- `Button` component (src/components/ui/button.tsx) — Primary/secondary/outline variants available
- `ReceiptForm` component (src/components/ReceiptForm.tsx) — Main form component where button will integrate
- Validation utilities (src/lib/validation.ts) — Can extend for batch generation validation

### Established Patterns
- Accordion sections for form organization (Phases 2 & 3)
- Inline validation on blur + submit (Phase 2)
- Explicit user action buttons (save button pattern from Phase 2)
- Full form validation before major actions
- French locale formatting throughout

### Integration Points
- Button will be added to `ReceiptForm` component after date range accordion section
- `generateReceiptPDF()` will be called in loop for each `MonthlyReceipt` in the array
- Need to install/import ZIP library (JSZip or similar) for batch packaging
- Browser download API (`URL.createObjectURL()`, `<a>` element click) for triggering download
- Progress state management (useState hook) to track generation progress
- Form validation from `useReceiptForm` hook needs to be called before generation

</code_context>

<specifics>
## Specific Ideas

- No preview keeps the UX simple and direct — users define what they want via form, then get it
- Progress indicator is critical for UX — PDF generation can take a few seconds for 12+ receipts
- Failing entire batch on error prevents the nightmare scenario of discovering missing receipts later
- Tenant name in ZIP filename is a thoughtful touch for landlords managing multiple properties
- Flat ZIP structure with date-based filenames is the sweet spot of organization without over-engineering
- Button placement after date pickers creates natural flow and doesn't require sticky positioning
- Auto-download removes friction — single click from intent to result
- Full validation upfront respects user's time by catching issues before slow generation starts

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-preview-export*
*Context gathered: 2026-03-12*
