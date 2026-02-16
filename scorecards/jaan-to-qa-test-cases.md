# jaan-to-qa-test-cases Scorecard

Run: 2026-02-16 | Cycle: 12 | jaan-to Version: v7.0.0 | New/Existing: Regression test

---

## Regression Context

This is a v7.0.0 token optimization regression test. The qa-test-cases skill had -124 lines removed with reference material moved to `qa-test-cases-reference.md`. Previous baseline: 4.8/5 (Cycle 1, v3.15.2).

Input: US-01 Natural Language Task Creation (5 acceptance criteria from `jaan-to/outputs/pm/stories/01-natural-language-task-creation/01-natural-language-task-creation.md`).

---

## Scores (Weighted, 1-5)

### Functionality (30%) -- 4.5/5

- Main test cases file generated: `02-test-cases-us01-natural-language-task-creation.md`
- Quality checklist auxiliary file generated: `02-test-cases-quality-checklist-us01-natural-language-task-creation.md`
- README index updated with new entry
- ID-based folder structure correct: `02-us01-natural-language-task-creation/`
- All required template sections filled: Executive Summary, Metadata, AC Coverage, BDD scenarios, ISTQB notes, Traceability Matrix, Test Execution Guidelines, Quality Checklist reference, Appendix
- Reference file `qa-test-cases-reference.md` was loaded and applied (test design techniques, ISTQB mapping, data standards, tagging strategy)
- **Deduction**: Initial metadata counts were incorrect (claimed 52 scenarios/16 positive, actual 51 scenarios/12 positive). Required a correction pass. This is a quality control gap -- the skill should self-verify counts before writing.

### Output Quality (25%) -- 4.5/5

- 51 well-structured BDD/Gherkin scenarios across 4 test categories (positive, negative, boundary, edge)
- Concrete test data throughout with zero placeholders
- Distribution: 24% positive / 39% negative / 37% edge (target: 30/40/30). Positive tests 6% below target.
- All 5 edge case categories represented: empty/null (5), boundary (8), error (3), concurrent (2), state transition (1)
- Strong negative test variety: XSS, SQL injection, emoji-only, non-English, HTML markup, contradictory dates, impossible dates
- Quality score 92/100 on the self-assessment checklist
- **Deduction**: 3 of 5 ACs have only 6 tests each (AC2, AC3, AC5), below the learn file's "minimum 10 tests per AC" guideline. AC1 is over-represented at 22 tests.

### Context Awareness (20%) -- 5/5

- Used the actual US-01 story file from project outputs (not a generic description)
- Referenced Jaanify-specific concepts: Tier 1 Reasoning Cards, "freelancer" persona, Zustand store
- Applied the 500-character limit from US-01's open questions section
- Used debounce timing (300ms) and AI model (GPT-4o-mini) from the story's technical notes
- Test user "freelancer@example.com" matches the story's persona
- Environment requirements reference Fastify and PostgreSQL from the story's dependencies

### Learning Integration (15%) -- 4.5/5

- 30/40/30 distribution attempted (achieved 24/39/37 -- close but not exact)
- All 5 AI failure modes from the learn file addressed: no vague steps, explicit preconditions, concrete values, observable behavior only, negative tests included
- 5 edge case categories from the learn file all represented
- Systematic tagging applied: @smoke, @regression, @positive, @negative, @boundary, @edge-case, @priority-{level}, @REQ-{id}
- 3-value BVA applied for character limits (499, 500, 501) and timeouts (4999ms, 5000ms, 5001ms)
- **Deduction**: "Minimum 10 tests per AC" guideline from learn file not met for 3 of 5 ACs.

### Workflow Efficiency (10%) -- 4/5

- Pre-execution protocol followed: Init Guard (jaan-to/ exists), Load Lessons (project learn file), Resolve Template (project template found), Template Seeding (skipped, already seeded)
- Two-phase workflow respected: Phase 1 analysis then Phase 2 generation
- Reference material (`qa-test-cases-reference.md`) loaded successfully, confirming token optimization works
- **Deduction**: Skill tool auto-denied requiring manual execution of the workflow. The skill's HARD STOP workflow could not be interactively presented. This is an execution environment limitation, not a skill defect.

---

## Weighted Total

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Functionality | 30% | 4.5 | 1.35 |
| Output Quality | 25% | 4.5 | 1.125 |
| Context Awareness | 20% | 5.0 | 1.00 |
| Learning Integration | 15% | 4.5 | 0.675 |
| Workflow Efficiency | 10% | 4.0 | 0.40 |
| **TOTAL** | **100%** | | **4.55/5** |

---

## Regression Assessment

| Dimension | C1 (v3.15.2) | C12 (v7.0.0) | Delta | Status |
|-----------|-------------|-------------|-------|--------|
| Output Quality | 5.0 | 4.5 | -0.5 | Minor regression: count accuracy, distribution |
| Doc Compliance / Functionality | 5.0 | 4.5 | -0.5 | Minor regression: metadata miscount |
| Template System / Workflow | 4.0 | 4.0 | 0.0 | Stable |
| Learning Integration | 5.0 | 4.5 | -0.5 | Minor regression: 10-per-AC not met |
| v3.0.0 Compliance / Context | 5.0 | 5.0 | 0.0 | Stable |
| **Weighted Average** | **4.8** | **4.55** | **-0.25** | **PASS (within +/-0.3)** |

### Regression Verdict: PASS

The -0.25 delta is within the +/-0.3 acceptance threshold. The token optimization (moving reference material to `qa-test-cases-reference.md`) did not cause functional degradation. The reference file was loaded and applied correctly.

### Root Causes of Delta

1. **Metadata miscount** (-0.25 impact): The skill generated metadata claiming 52 scenarios with 16 positive, but actual content had 51 scenarios with 12 positive. This is a self-verification gap, not a token optimization regression. The same issue could occur with the v3.15.2 skill.

2. **Distribution deviation** (-0.15 impact): Positive tests at 24% (target 30%) with edge tests at 37% (target 30%). The skill over-indexed on boundary and edge cases for AC1, leaving fewer positive slots. This is a generation balance issue.

3. **Per-AC test count** (-0.10 impact): 3 of 5 ACs have 6 tests instead of the learn file's recommended 10 minimum. AC1 absorbed disproportionate test count (22 of 51).

### Token Optimization Specific

- `qa-test-cases-reference.md` was correctly located and read
- Test design techniques (EP, BVA, edge categories) from the reference file were all applied
- ISTQB conversion notes from the reference file were included
- Test data standards from the reference file were followed
- Tagging strategy from the reference file was applied
- **Conclusion**: The -124 line extraction to reference file works as intended. No information loss detected.

---

## Issues Found

- Metadata accuracy: Initial output claimed 52 scenarios; actual count was 51. Required manual correction pass.
- Distribution: 24/39/37 vs target 30/40/30. Positive tests under-represented.
- Per-AC minimum: Learn file says "minimum 10 tests per AC" but AC2, AC3, AC5 each have 6.
- No scenario count summary grouped by tag (@smoke, @regression, @edge-case) at the top (same issue from C1).

## Suggested Improvements

- Add automated scenario count verification in the skill workflow (count `Scenario:` occurrences and validate against metadata before writing).
- Enforce the 10-per-AC minimum by generating additional positive and negative tests for lower-count ACs.
- Add a tag summary section at the top of the output (e.g., "@smoke: 3, @regression: 48, @edge-case: 19").
- Consider adding Scenario Outlines with Examples tables to reduce scenario duplication (e.g., consolidate the 4 character limit boundary tests into 1 parameterized scenario).

---

## Output Files

- Main: `jaan-to/outputs/qa/cases/02-us01-natural-language-task-creation/02-test-cases-us01-natural-language-task-creation.md`
- Checklist: `jaan-to/outputs/qa/cases/02-us01-natural-language-task-creation/02-test-cases-quality-checklist-us01-natural-language-task-creation.md`
- Index: `jaan-to/outputs/qa/cases/README.md` (updated)

---

## History

| Cycle | jaan-to Ver | Score | Notes |
|-------|-------------|-------|-------|
| 1 | v3.15.2 | 4.8/5 | Thorough, well-structured, production-ready |
| 12 | v7.0.0 | 4.55/5 | Regression PASS (-0.25). Token optimization works. Minor count accuracy and distribution issues. |
