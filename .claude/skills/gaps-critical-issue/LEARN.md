# Lessons: gaps-critical-issue

> Last updated: 2026-02-10

Accumulated lessons from past executions of issue report generation.

---

## Better Questions

Questions that improve issue quality:

<!-- Future lessons will be added here -->

## Edge Cases

Special cases to check:

<!-- Future lessons will be added here -->

## Workflow

Process improvements:

- **2026-02-10 (Issue #53)**: Always link the project name **Jaanify** to its GitHub repo `https://github.com/parhumm/jaanify` using markdown link syntax `[Jaanify](https://github.com/parhumm/jaanify)` — every mention in the issue body should be a clickable link to the project repo.

- **2026-02-10 (Issue #51)**: Opening paragraph should reference specific deliverable counts (e.g., "17 deliverables", "21 endpoints", "74 BDD scenarios") — these concrete numbers make the PM voice credible and show the investment that's been made.
- **2026-02-10 (Issue #51)**: Each gap section should include at least one direct code reference or command that fails (e.g., "`pnpm test` crashes immediately", "21 route handlers that return `// TODO: implement`") — abstract descriptions don't convey urgency.

## Common Mistakes

Things to avoid:

- **Don't use formal gap-report language** in the issue body. "Gap L-01: Service Implementation Skill" should become "Every single route handler returns `// TODO: implement`". The L-NN ID goes in the section heading parenthetical, not in the pain description.
- **Don't genericize the impact**. "This blocks launch" is weak. "Jaanify's core value prop (AI-powered task prioritization) is an empty function right now" is specific and visceral.
- **Don't skip the "What we already have" section**. It's tempting to jump from pain to solution, but showing existing investment ("the inputs are all there") makes the request credible — we're not asking for everything, just the last mile.