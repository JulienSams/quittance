# Phase 6: Polish & Responsive Design - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Finalize UI/UX polish and ensure mobile responsiveness for the receipt generator application. Refine responsive layout for phone screens, apply consistent spacing and visual styling, enhance form validation presentation, and add success state indicators. This phase completes the MVP user experience by ensuring the application looks professional and works smoothly across devices.

</domain>

<decisions>
## Implementation Decisions

### Mobile Responsiveness
- **Phone-first optimization** — Focus on screens < 640px where space is tightest
- Tablet and desktop already work well with accordion layout (from Phase 2)
- **Standard text inputs** — Keep current input elements, let browser handle mobile keyboards
- No special inputMode or auto-scroll behaviors — simplicity over optimization
- **Smaller heading on mobile** — Reduce h1 from text-3xl to text-2xl/xl on small screens
- Saves vertical space and prevents awkward line breaks
- **Keep popover calendar** — Existing Calendar component in popover works well on mobile
- No need for native date picker or modal variants — consistent UX across devices

### Visual Polish & Consistency
- **Systematic spacing scale** — Use consistent Tailwind spacing throughout (space-y-4, space-y-6, space-y-8)
- Creates visual rhythm and professional feel instead of arbitrary gaps
- **Subtle background colors** — Add bg-muted/5 or bg-slate-50 inside accordion items
- Helps distinguish sections without being heavy-handed
- Current borders provide structure, backgrounds add subtle depth
- **Inline validation errors** — Red accent styling for errors
- Error text below field in `text-destructive` color (shadcn convention)
- Input field border turns red on validation error
- Contextual and clear without requiring toasts
- **Success state indicators** — Checkmark + green text for successful actions
- Show ✓ icon with green success message (e.g., near save button after save)
- Clear confirmation without intrusive toasts or animations

### Claude's Discretion
- Exact spacing values and where to apply space-y-4 vs space-y-6 vs space-y-8
- Specific breakpoint for mobile heading resize (sm:text-3xl or md:text-3xl)
- Whether to add Card wrappers around entire form or keep flat accordion
- Loading spinner placement and style for batch generation (already has progress text)
- Whether to add button hover states or keep defaults
- Transition/animation timing for accordion open/close
- Whether success message auto-dismisses after timeout or stays visible
- Touch target sizes (if current 44px+ targets need adjustment)
- Whether to add any help text or tooltips (not discussed — decide based on user testing)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Button` component with variants (default, secondary, outline) — consistent button styling
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` — established layout pattern
- `Input` and `Label` components — form controls already styled
- `Card` component — available if needed for additional structure
- `cn()` utility — for conditional className merging with Tailwind
- Form already has responsive accordion from Phase 2
- Batch generation already has progress indicator: `progress.current / progress.total`
- Validation errors stored in `errors` object from `useReceiptForm` hook

### Established Patterns
- Accordion sections for form organization (Propriétaire, Locataire, Bien, Loyer, Période)
- Sticky save button at bottom of viewport (Phase 2)
- French locale throughout
- Dark blue accent color (#1e3a8a) from Phase 4
- Inline validation on blur + submit (Phase 2)
- Generous whitespace and modern readability (Phase 4)

### Integration Points
- `ReceiptForm.tsx` — main component to polish
- Tailwind responsive classes (sm:, md:, lg:) for mobile optimizations
- `errors` object from `useReceiptForm` hook needs visual styling
- `saveSuccess` state from hook can trigger success indicator
- `isGenerating` and `generationError` states already exist for batch generation feedback
- App.tsx header section needs responsive text sizing

</code_context>

<specifics>
## Specific Ideas

- Phone-first focus (< 640px) is strategic — if it works on phone, tablet/desktop are already fine
- Keeping standard inputs simple avoids mobile keyboard edge cases and complexity
- Systematic spacing creates visual rhythm — space-y-4 for tight groups, space-y-6 for sections, space-y-8 for major separations
- Subtle backgrounds help users scan accordion sections without heaviness of full Card borders
- Inline red errors are contextual and clear — user immediately sees what needs fixing
- Checkmark + green text for success is unobtrusive but confirmatory — no need for toasts that disappear

</specifics>

<deferred>
## Deferred Ideas

- Loading states for individual sections (beyond batch generation progress) — add if user testing shows need
- Help text and tooltips for legal requirements — not discussed, decide based on feedback
- Clear/reset functionality — mentioned in roadmap but not discussed, Claude can decide placement
- Touch target size adjustments — not discussed, assume current sizes are adequate unless testing shows issues

</deferred>

---

*Phase: 06-polish-responsive*
*Context gathered: 2026-03-12*
