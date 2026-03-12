# Phase 4: PDF Template & Generation - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Create a legally compliant PDF template for French rental receipts (quittances de loyer) and implement single receipt generation. The template renders data from MonthlyReceipt objects (prepared in Phase 3) into professional, printable PDFs that meet ALUR law requirements. This establishes the PDF rendering layer that will be used for batch export in Phase 5.

</domain>

<decisions>
## Implementation Decisions

### PDF Layout & Structure
- Traditional French quittance format — follows conventional structure that landlords and tenants expect
- Centered title block: "QUITTANCE DE LOYER" centered at top, followed by period centered below ("Période : Février 2026")
- Landlord/tenant in two-column side-by-side layout — space-efficient, easy to compare
- Property address after landlord/tenant blocks, before amounts — logical flow: who → what → how much
- Receipt number in top right corner — standard document numbering position for easy reference

### Legal Compliance Strategy
- Simple 2-column rent breakdown table: Description | Amount (reuses TestPDF table pattern)
- Legal mentions in footer at bottom of page — ALUR law text, payment confirmation in small text
- Prorated months include calculation detail: show note like "*Montant proratisé : 15 jours sur 31" below amounts table for transparency
- Period display: Month and year only ("Période : Février 2026") — simple for full months, with dates in parentheses for partial months

### Receipt Numbering & Metadata
- Receipt number format: Year-Month-Sequence ("2026-02-001") — groups by period, easy chronological organization
- Sequence number: Always 001 for each month — assumes one receipt per month per property (typical use case)
- Metadata: Generation date only ("Document généré le 12/03/2026") — sufficient without clutter
- Receipt number placement: Top right corner next to title

### Visual Branding & Professionalism
- Minimal accent color: Dark blue (#1e3a8a) for headers or borders — professional, trustworthy, prints well
- Borders: Minimal, only around amounts table — emphasizes financial information (follows TestPDF pattern)
- Whitespace: Generous spacing — plenty of whitespace between sections, wide margins for modern readability
- Professional appearance with print quality in mind

### Claude's Discretion
- Exact font sizes for different text levels (title, headers, body, footer)
- Precise spacing values for margins and section gaps
- Whether to bold certain labels or keep all text regular weight
- How to format dates (DD/MM/YYYY vs written out)
- Handling edge cases like very long addresses
- PDF filename convention for generated files

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TestPDFDocument` component (src/components/TestPDF.tsx) — working table layouts, French text rendering, styling patterns to reuse
- `LEGAL_MENTIONS` constants (src/lib/constants/french-legal.ts) — ALUR_MENTION, RECEIPT_PURPOSE, PAYMENT_CONFIRMATION already defined
- `formatAmount()` helper (src/lib/constants/french-legal.ts) — French currency formatting (1 234,56 €)
- `MonthlyReceipt` type (src/types/receipt.ts) — includes period, amounts, and optional receiptNumber field
- `FONT_FAMILY` constant (src/lib/pdf-fonts.ts) — professional fonts already configured
- StyleSheet patterns from TestPDF — page, title, table, footer styles ready to adapt

### Established Patterns
- @react-pdf/renderer Document/Page/View/Text components for layout
- StyleSheet.create() for consistent styling
- French locale formatting throughout (dates, amounts, text)
- Table structure with flexDirection: 'row' for columns
- Border styling for tables (TestPDF demonstrates this)

### Integration Points
- Takes `MonthlyReceipt` data from Phase 3 (period, amounts already calculated including prorata)
- Uses `ReceiptData` for landlord/tenant/property details
- Outputs single PDF blob for Phase 5 batch ZIP creation
- Font configuration via pdf-fonts.ts (already handles French characters)
- Legal text from french-legal.ts constants

</code_context>

<specifics>
## Specific Ideas

- Traditional format choice means following established French administrative document conventions — this builds trust
- Two-column layout for landlord/tenant maximizes space efficiency while maintaining clear separation
- Prorata calculation note prevents disputes by showing transparency ("15 jours sur 31" makes it obvious)
- Dark blue accent (#1e3a8a) strikes the right balance — professional without being dull, but still print-friendly
- Generous whitespace prioritizes readability over cramming content — rental receipts should be easy to scan
- Receipt number format (2026-02-001) makes chronological filing natural for landlords managing multiple properties

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-pdf-generation*
*Context gathered: 2026-03-12*
