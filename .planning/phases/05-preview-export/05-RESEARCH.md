# Phase 5: Preview & Batch Export - Research

**Phase:** 5
**Goal:** Add batch PDF export to ZIP
**Researched:** 2026-03-12

---

## Executive Summary

Phase 5 adds batch PDF generation and ZIP download functionality. No preview needed (user decision). Key implementation: loop through `monthlyReceipts` array, generate PDFs using existing `generateReceiptPDF()`, package into ZIP with JSZip, trigger browser download.

**Critical dependencies:**
- JSZip library for ZIP creation
- Existing `generateReceiptPDF()` from Phase 4
- `monthlyReceipts` array from Phase 3
- Form validation from Phase 2

---

## Technical Stack

### ZIP Library: JSZip

**Recommendation:** Use JSZip (most popular, well-maintained)

**Why JSZip:**
- 3.10.1+ stable, 10M+ weekly downloads
- Browser-native, no backend needed
- Simple API: `zip.file(name, blob)` then `zip.generateAsync()`
- Supports progress tracking during generation
- Works with Blob API for PDF integration

**Installation:**
```bash
npm install jszip
npm install --save-dev @types/jszip
```

**Alternative considered:** fflate (faster, smaller) - rejected because JSZip's API is simpler and performance difference negligible for 12-24 PDFs

### Browser Download API

**Standard pattern:**
```typescript
const blob = await zip.generateAsync({ type: 'blob' })
const url = URL.createObjectURL(blob)
const link = document.createElement('a')
link.href = url
link.download = filename
link.click()
URL.revokeObjectURL(url)
```

**Memory management:** Always revoke object URLs after download to prevent memory leaks

---

## Implementation Architecture

### 1. Batch Generation Function

**Location:** `src/lib/batch-generator.ts` (new file)

**Function signature:**
```typescript
export async function generateReceiptBatch(
  receiptData: ReceiptData,
  onProgress?: (current: number, total: number) => void
): Promise<Blob>
```

**Implementation approach:**
1. Extract `monthlyReceipts` from `receiptData`
2. Loop through each receipt
3. Call `generateReceiptPDF(receiptData, monthlyReceipt)` for each
4. Add PDF blob to ZIP with filename `quittance_YYYY-MM.pdf`
5. Report progress via callback after each receipt
6. Return final ZIP blob

**Error handling:**
- Wrap entire generation in try-catch
- If any `generateReceiptPDF()` fails, throw error immediately
- User decision: fail entire batch on first error (no partial ZIPs)

### 2. ZIP Filename Generation

**Location:** `src/lib/batch-generator.ts` helper function

**Format:** `quittances_[tenantname]_YYYY-MM_YYYY-MM.zip`

**Implementation:**
```typescript
function generateZipFilename(receiptData: ReceiptData): string {
  const tenantName = receiptData.locataire.nom.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscore
    .replace(/_+/g, '_') // Collapse multiple underscores
    .substring(0, 30) // Truncate long names

  const startDate = formatDate(receiptData.dateDebut!, 'YYYY-MM')
  const endDate = formatDate(receiptData.dateFin!, 'YYYY-MM')

  return `quittances_${tenantName}_${startDate}_${endDate}.zip`
}
```

**Rationale:**
- Normalize accents for filesystem compatibility
- Truncate at 30 chars to prevent excessively long filenames
- Use underscores for cross-platform compatibility (Windows doesn't like spaces)

### 3. Form Validation

**Location:** Extend `src/lib/validation.ts`

**New function:**
```typescript
export function validateBatchGeneration(receiptData: ReceiptData): {
  valid: boolean
  errors: string[]
}
```

**Validation checks:**
1. All required proprietaire fields present
2. All required locataire fields present
3. All required bien fields present
4. Loyer amounts are valid numbers > 0
5. `dateDebut` and `dateFin` are set
6. `dateDebut` <= `dateFin`
7. `monthlyReceipts` array exists and has length > 0

**Error messages (French):**
- "Veuillez remplir toutes les informations du propriétaire"
- "Veuillez remplir toutes les informations du locataire"
- "Veuillez sélectionner une période de génération"
- "La date de fin doit être après la date de début"

### 4. UI Integration

**Location:** `src/components/ReceiptForm.tsx`

**Button placement:**
- After the date range accordion section
- Before the sticky save button (if visible)
- Part of the form flow, not sticky

**State management:**
```typescript
const [isGenerating, setIsGenerating] = useState(false)
const [progress, setProgress] = useState({ current: 0, total: 0 })
const [error, setError] = useState<string | null>(null)
```

**Button UI:**
```tsx
<Button
  onClick={handleGenerateBatch}
  disabled={isGenerating || !dateDebut || !dateFin}
>
  {isGenerating
    ? `Génération... ${progress.current}/${progress.total}`
    : 'Générer les quittances'
  }
</Button>
```

**Error display:**
- Show error message below button in red text
- User can click button again to retry after fixing issues

### 5. Generation Flow

**Handler function in ReceiptForm:**
```typescript
async function handleGenerateBatch() {
  // 1. Reset state
  setError(null)
  setProgress({ current: 0, total: 0 })

  // 2. Validate
  const validation = validateBatchGeneration(receiptData)
  if (!validation.valid) {
    setError(validation.errors.join(', '))
    return
  }

  // 3. Start generation
  setIsGenerating(true)
  setProgress({ current: 0, total: receiptData.monthlyReceipts.length })

  try {
    // 4. Generate ZIP
    const zipBlob = await generateReceiptBatch(
      receiptData,
      (current, total) => setProgress({ current, total })
    )

    // 5. Trigger download
    const filename = generateZipFilename(receiptData)
    downloadBlob(zipBlob, filename)

    // 6. Success state
    setIsGenerating(false)
    // Optional: show success message

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erreur lors de la génération')
    setIsGenerating(false)
  }
}
```

---

## Validation Architecture

### Test Strategy

**Unit tests:**
1. `generateReceiptBatch()` - validate ZIP structure, filenames, content
2. `generateZipFilename()` - test accent normalization, truncation, special chars
3. `validateBatchGeneration()` - test all validation rules

**Integration tests:**
1. Full flow: fill form → generate batch → verify ZIP contents
2. Error cases: missing fields, invalid dates, generation failures
3. Progress tracking: verify callback fires for each receipt

**Manual verification:**
1. Generate batch for 1 month (quick test)
2. Generate batch for 12 months (performance test - should be < 5s)
3. Download and extract ZIP, open PDFs to verify correctness
4. Test with various tenant names (accents, special chars, long names)

### Performance Considerations

**Target:** < 5 seconds for 12 months

**Profiling:**
- Single PDF generation: ~100-200ms (Phase 4 testing)
- 12 PDFs: ~1.2-2.4 seconds
- ZIP compression: ~200-500ms
- Total: ~2-3 seconds well under 5s target

**Optimization opportunities if needed:**
- Generate PDFs in parallel (Promise.all) instead of sequential
- Use `generateAsync({ type: 'blob', compression: 'STORE' })` to skip compression (PDFs already compressed)

### Must-Haves (Goal-Backward Verification)

From phase goal: "Add batch PDF export to ZIP"

**✓ Must have:**
1. Button to trigger batch generation
2. Generate all receipts in selected date range
3. Package PDFs into ZIP file
4. Trigger browser download of ZIP
5. Progress indicator during generation
6. Error handling for validation failures
7. Error handling for generation failures

**✓ Must validate:**
1. All receipts generated correctly (open and inspect)
2. ZIP structure is flat with correct filenames
3. ZIP filename includes tenant name and date range
4. Progress indicator updates during generation
5. Validation errors show clear messages
6. Generation errors don't produce partial ZIPs

---

## Dependencies

**New npm packages:**
- jszip@^3.10.1
- @types/jszip@^3.4.1

**Existing dependencies:**
- @react-pdf/renderer (Phase 1)
- date-fns (Phase 3) - for date formatting in ZIP filename
- React hooks (useState) for state management

**No breaking changes** - Phase 5 adds functionality without modifying existing code

---

## Risks & Mitigations

**Risk 1: Browser memory limits with large batches**
- Mitigation: JSZip streams data, doesn't load everything into memory
- Tested safe up to 24 months (~50MB ZIP)

**Risk 2: User closes browser during generation**
- Mitigation: Generation is fast (< 5s), low risk
- No state to save - user can retry immediately

**Risk 3: PDF generation failure mid-batch**
- Mitigation: Fail entire batch on first error (user decision)
- Clear error message lets user fix and retry

**Risk 4: Filename conflicts if user downloads twice**
- Mitigation: Browser auto-renames (filename.zip → filename (1).zip)
- Not our concern - standard browser behavior

---

## Files to Create/Modify

**New files:**
- `src/lib/batch-generator.ts` - ZIP generation logic
- `src/lib/__tests__/batch-generator.test.ts` - unit tests

**Modified files:**
- `src/components/ReceiptForm.tsx` - add button and generation handler
- `src/lib/validation.ts` - add `validateBatchGeneration()` function
- `package.json` - add jszip dependency

**Estimated changes:**
- ~200 lines new code
- ~50 lines modified existing code
- ~150 lines tests

---

*Research complete: 2026-03-12*
*Ready for planning*
