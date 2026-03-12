# Roadmap: Générateur de Quittances de Loyer

## Milestone 1: MVP Launch

**Goal**: Deliver a functional rent receipt generator that allows French landlords to generate legally compliant receipts for furnished rentals.

**Success Criteria**:
- Can generate multiple receipts for a date range
- PDFs are legally compliant for French furnished rentals
- Data persists locally for reuse
- Works on desktop and mobile

---

## Phase 1: Project Setup & Foundation
**Goal**: Set up React project with TypeScript, shadcn/ui, and PDF generation capability

**Deliverables**:
- React + TypeScript project initialized
- shadcn/ui configured and theme set up
- PDF generation library integrated and tested
- Basic project structure established

**Success Criteria**:
- Can create and build the project
- Can generate a simple test PDF in browser
- shadcn components render correctly

---

## Phase 2: Core Form & Data Model
**Goal**: Build the input form for all required receipt information

**Deliverables**:
- Data model/types for landlord, tenant, property, and receipt
- Form UI with shadcn components
- Form validation for all required fields
- localStorage integration for data persistence

**Success Criteria**:
- All required information can be entered
- Form validates French-specific requirements (address format, amounts)
- Data persists between browser sessions
- Form is responsive on mobile

---

## Phase 3: Date Range & Receipt Logic
**Goal**: Implement date range selection and monthly receipt generation logic

**Deliverables**:
- Date range picker (start/end date)
- Logic to generate list of months between dates
- Prorata calculation for partial months (based on real days)
- Month-by-month receipt data structure

**Success Criteria**:
- Can select any valid date range
- Correctly generates receipts for each month in range
- Prorata calculation is accurate for partial first/last months
- Handles edge cases (same month, year boundaries)

---

## Phase 4: PDF Template & Generation
**Goal**: Create legally compliant PDF template and generate individual receipts

**Deliverables**:
- PDF template with all mandatory French legal mentions
- Rent breakdown (loyer + charges) per ALUR law
- Professional, printable layout
- Single receipt PDF generation

**Success Criteria**:
- PDF contains all mandatory legal information
- Layout is clear and professional
- Amount calculations are correct
- PDF is print-ready quality

---

## Phase 5: Preview & Batch Export
**Goal**: Add preview functionality and batch PDF export to ZIP

**Deliverables**:
- Preview modal showing one receipt before generation
- Batch generation of all receipts in date range
- ZIP file creation with all PDFs
- Download functionality

**Success Criteria**:
- Can preview receipt before generating batch
- All receipts in range are generated correctly
- ZIP downloads with proper naming convention
- Generation performance is acceptable (< 5s for 12 months)

---

## Phase 6: Polish & Responsive Design
**Goal**: Finalize UI/UX, ensure mobile responsiveness, and add helpful features

**Deliverables**:
- Responsive layout refinements
- Loading states and error handling
- Help text and tooltips for legal requirements
- Clear/reset functionality
- Final design polish

**Success Criteria**:
- Works smoothly on mobile, tablet, desktop
- User understands what information is required and why
- Error messages are clear and helpful
- Professional appearance throughout

---

**Estimated Timeline**: 6 phases
**Current Phase**: Not started
