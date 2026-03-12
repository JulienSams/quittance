---
phase: 5
slug: preview-export
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` (existing) |
| **Quick run command** | `npm run test src/lib/batch-generator.test.ts` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test src/lib/batch-generator.test.ts`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 3 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 0 | Install JSZip | integration | `npm run build` | ✅ | ⬜ pending |
| 05-01-02 | 01 | 1 | ZIP generation | unit | `npm run test batch-generator.test.ts` | ❌ W0 | ⬜ pending |
| 05-01-03 | 01 | 1 | Filename generation | unit | `npm run test batch-generator.test.ts` | ❌ W0 | ⬜ pending |
| 05-01-04 | 01 | 1 | Validation function | unit | `npm run test validation.test.ts` | ✅ | ⬜ pending |
| 05-01-05 | 01 | 2 | UI integration | integration | `npm run test ReceiptForm.test.tsx` | ❌ W0 | ⬜ pending |
| 05-01-06 | 01 | 2 | Error handling | integration | `npm run test batch-generator.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/__tests__/batch-generator.test.ts` — unit tests for ZIP generation, filename generation, error handling
- [ ] `src/components/__tests__/ReceiptForm.test.tsx` — integration test for button and generation flow (if doesn't exist)
- [ ] Mock JSZip in tests for isolation

*Existing validation.test.ts covers validation function tests.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| ZIP downloads successfully | User can download | Browser security model | 1. Fill form, 2. Select dates, 3. Click "Générer", 4. Verify ZIP downloads |
| PDFs open correctly | PDFs are valid | File inspection needed | 1. Extract ZIP, 2. Open each PDF, 3. Verify content matches form data |
| Progress updates during generation | UX feedback | Visual inspection | 1. Generate 12 months, 2. Watch progress indicator update |
| Long tenant names truncated | Filename length limits | Filesystem behavior | 1. Enter 50-char tenant name, 2. Verify ZIP filename is reasonable length |

*Browser download API cannot be fully automated in tests.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 3s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
