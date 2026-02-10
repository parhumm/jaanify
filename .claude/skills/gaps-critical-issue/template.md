# Issue Body Template — gaps-critical-issue

> Tone model: Human PM voice. Based on GitHub issue #51 (parhumm/jaan-to).
> Language: Always English (regardless of conversation language).

---

## Structure

### Opening

```markdown
Hi team,

We've been building **{{project_name}}** ({{project_description}}) entirely with jaan-to for {{cycle_count}} cycles now. The plugin has been fantastic for specification and scaffolding — we've generated {{deliverable_count}} deliverables including {{deliverable_highlights}}.

But here's the honest truth: **{{blunt_status_statement}}**. {{elaboration_on_gap}}.

This issue covers the {{gap_count}} most critical gaps ({{priorities_label}}) that are blocking our {{what_is_blocked}}.
```

**Tone rules for opening:**
- First paragraph: genuine appreciation + concrete numbers (show investment)
- Second paragraph: "here's the honest truth" + bold stat + what that means in practice
- Third paragraph: scope of this issue

---

### Priority Section Heading

```markdown
## P0 — Launch Blockers
```

or

```markdown
## P1 — Security & Deployment (can't go public without these)
```

or

```markdown
## P2 — GTM Essentials
```

**Rule**: Use the same heading style as the gap report but add a human parenthetical.

---

### Per-Gap Section

```markdown
### {{gap_number}}. {{human_title}} (Gap L-{{gap_id}})

**The pain:** {{pain_description}}

**What we already have (the inputs are all there):**
{{existing_inputs_list}}

**What's missing:** {{missing_description}}

**Why it matters:** {{impact_description}}

**Expected output:**
{{expected_outputs_list}}
```

**Tone rules per field:**

| Field | Voice | Anti-pattern |
|-------|-------|-------------|
| **The pain** | Visceral, specific, concrete numbers. "Every single route handler returns `// TODO: implement`". "crashes immediately". "do literally nothing". | "There is a gap in service implementation" |
| **What we already have** | Proof of investment. Bullet list with counts. "the inputs are all there". "we invested in writing 74 detailed test scenarios". | "Some specifications exist" |
| **What's missing** | Specific skill or improvement. "A skill that reads these specs and generates actual business logic". "The scaffold should generate secure auth by default". | "We need a solution" |
| **Why it matters** | Business/user/trust impact. "This is a legal and trust issue, not just a technical one". "every project that uses backend-scaffold ships with this same insecure pattern". | "This is important for launch" |
| **Expected output** | Concrete files and deliverables. Bullet list. "Filled service files with real Prisma queries". "A `pnpm test` command that actually runs and passes". | "Working implementation" |

---

### Summary Table

```markdown
## Summary

| Priority | Gap | Need | Type |
|----------|-----|------|------|
| **{{priority}}** | L-{{id}} | {{title}} | {{type}} |
...

**{{new_skills_count}} new skills needed**, **{{improvements_count}} existing skills need improvement**.

Critical path: {{critical_path_one_liner}}
```

**Type values**: "New skill" or "Scaffold improvement"

---

### Footer

```markdown
**Project:** {{project_name}} — {{project_description}}
**Full analysis:** `{{gap_report_path}}`
**jaan-to version:** {{jaan_to_version}}
```

---

## Tone Cheat Sheet

| Do | Don't |
|----|-------|
| "21 endpoints that do literally nothing" | "Service implementation is incomplete" |
| "crashes immediately" | "fails to execute" |
| "anyone can forge a valid-looking token" | "authentication has vulnerabilities" |
| "the irony is painful" | "this is suboptimal" |
| "you can't ship what you can't deploy" | "deployment capabilities are lacking" |
| "parts catalog, not an assembled product" | "components need integration" |
| "we invested in writing 74 detailed test scenarios that are just documentation" | "test cases exist but are not automated" |