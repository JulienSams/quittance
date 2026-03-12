---
phase: 6
slug: polish-responsive
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (existing) |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npm run test -- src/components/ReceiptForm.test.tsx` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~3-5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- src/components/ReceiptForm.test.tsx`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | Mobile heading | visual | manual browser test | N/A | ⬜ pending |
| 06-01-02 | 01 | 1 | Semantic colors | unit | `npm run test -- validation` | ❌ W0 | ⬜ pending |
| 06-01-03 | 01 | 1 | Spacing consistency | visual | manual browser test | N/A | ⬜ pending |
| 06-01-04 | 01 | 1 | Accordion backgrounds | visual | manual browser test | N/A | ⬜ pending |
| 06-02-01 | 02 | 1 | Success indicator | unit | `npm run test -- success` | ❌ W0 | ⬜ pending |
| 06-02-02 | 02 | 1 | Reset functionality | unit | `npm run test -- reset` | ❌ W0 | ⬜ pending |
| 06-02-03 | 02 | 1 | Batch UI polish | visual | manual browser test | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/__tests__/validation.test.ts` — test semantic color updates don't break validation
- [ ] `src/components/__tests__/ReceiptForm-success.test.tsx` — test success indicator appears after save
- [ ] `src/components/__tests__/ReceiptForm-reset.test.tsx` — test reset functionality with confirmation

*Wave 0 creates test stubs for automated verifications.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Mobile heading readable | Visual polish | Visual/UX check | Open DevTools, resize to 375px, verify heading doesn't break lines awkwardly |
| Spacing visual rhythm | Visual polish | Visual/UX check | Scan accordion sections, verify consistent space-y-4/6/8 application |
| Accordion backgrounds subtle | Visual polish | Visual/UX check | Open accordion items, verify bg-muted/5 adds depth without being heavy |
| Batch progress visible | UX feedback | Visual/UX check | Generate batch, verify spinner and progress text appear clearly |

*Manual verifications cover visual/UX aspects not easily automated.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
