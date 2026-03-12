# Phase 1: Project Setup & Foundation - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up a React + TypeScript project with Vite, configure shadcn/ui components, and integrate @react-pdf/renderer for client-side PDF generation. Validate that all three work together by generating a test PDF with French text and formatting. This phase establishes the technical foundation for the entire application.

</domain>

<decisions>
## Implementation Decisions

### PDF Generation Library
- Use @react-pdf/renderer (template-based, JSX/React components that render to PDF)
- Set up custom fonts for professional output (not default Helvetica/Times)
- Test PDF must validate French text with accents and multiple text styles
- Test should include basic layout/formatting, not just "Hello World"

### Project Bootstrapping
- Use Vite to initialize React + TypeScript project
- No routing library needed (single-page application)
- Configure ESLint + Prettier from the start for code quality

### Claude's Discretion
- Whether to create a basic layout/shell component or just empty App.tsx
- Choice of specific custom font (e.g., Inter, Roboto, Open Sans)
- Exact ESLint/Prettier configuration rules
- Which shadcn components to install upfront vs on-demand
- Theme configuration details (colors, spacing)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
None — this is a greenfield project starting from scratch.

### Established Patterns
None — Phase 1 will establish the patterns for subsequent phases.

### Integration Points
- Vite dev server and build configuration
- shadcn/ui CLI for component installation
- @react-pdf/renderer Document/Page/View components
- Font registration with @react-pdf/renderer

</code_context>

<specifics>
## Specific Ideas

- The test PDF should prove we can handle French legal text (accents like é, è, à, ô, etc.)
- Professional appearance is important from the start (hence custom fonts requirement)
- Keep the setup simple — no over-engineering for features we don't need (like routing)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-project-setup*
*Context gathered: 2026-03-12*
