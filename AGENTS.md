# AGENTS.md

## Project Overview

This project is a civic technology website for comparing Taiwanese local-election
candidate policies with a user's stated preferences. The product explains policy
similarity and evidence quality; it does not recommend a candidate or use party
identity as a score.

The MVP uses Next.js App Router, TypeScript, and Tailwind CSS. It starts with
client-side seed data and an anonymous session. The first flow is:

1. Select an election position.
2. Answer the position-specific policy questionnaire.
3. Select a city, district, or constituency.
4. Compare candidates within that selected area.

## Working Guidelines

- Inspect the existing project structure and nearby documentation before making changes.
- Keep changes focused on the requested task and preserve established patterns.
- Do not overwrite user changes or unrelated files.
- Prefer small, readable implementations over unnecessary abstractions.
- Add or update tests when behavior changes.
- Keep scoring deterministic and data-driven; never hardcode a candidate or party adjustment.
- Keep Match Score and Confidence separate.
- Treat missing data as unknown or `N/A`, never as a zero score.
- Keep policy match, feasibility, and fulfillment as separate dimensions.
- Preserve enough input data for every displayed score to be explained.
- Do not use an LLM to rank candidates in the MVP.

## MVP Scope

- Use a small, manually maintained seed dataset to validate the flow across multiple areas.
- Use different issue sets and questions for different election positions.
- Implement the scoring engine as a pure TypeScript module outside UI components.
- Start with fixed questionnaires; adaptive questions, scraping, login, and AI extraction are later work.
- Do not add political-spectrum labels or party-based ranking.

## Current Implementation Status

Completed:

- Next.js App Router, TypeScript, Tailwind CSS, and Vitest are configured.
- The home page links into the policy questionnaire.
- The questionnaire supports separate mayor and councilor question sets.
- Questionnaire answers and issue priorities persist in `localStorage`.
- Seed data covers two areas with mayor and councilor candidates.
- Area selection leads to an explainable result page.
- The scoring module calculates deterministic Policy Match, Confidence, weighted issue similarity, and per-issue breakdowns.
- Missing candidate positions are shown as `N/A` and excluded from the Policy Match denominator.
- Scoring tests cover identical and opposite positions, missing data, issue weights, and deterministic ranking.

Current routes:

```text
/
/survey
/location
/result?area=taichung-xitun
/result?area=kaohsiung-lingya
```

Latest validation status:

- `npm test` passes 5 scoring tests.
- `npm run lint` passes.
- `npm run build` passes.
- `git diff --check` passes, aside from Git's normal LF-to-CRLF warning on Windows.
- `npm audit` reports dependency vulnerabilities. Do not run `npm audit fix --force` unless explicitly requested; it may introduce breaking dependency changes.

Next implementation priorities:

1. Improve result comparison and source/evidence display.
2. Add a methodology page explaining scoring and missing-data treatment.
3. Expand seed data and add tests for position and area filtering.
4. Consider Next.js Route Handlers and a database only after the client-side MVP is stable.

## Validation

- Discover available validation commands from the project manifest and documentation.
- Run scoring unit tests after changes to matching or ranking behavior.
- Run the narrowest relevant test, lint, typecheck, or build command after edits.
- Verify both position-specific questionnaire flows and area filtering when those paths change.
- Report any checks that could not be run and why.

## Git

- Do not create commits or branches unless explicitly requested.
- Review the final diff for unrelated changes before handing work back.<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
