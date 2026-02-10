---
title: "{{title}}"
cycle: {{cycle_number}}
date: {{date}}
jaan_to_version: "{{jaan_to_version}}"
previous_cycle: {{previous_cycle}}
gap_summary:
  total: {{total_gaps}}
  p0: {{p0_count}}
  p1: {{p1_count}}
  p2: {{p2_count}}
  p3: {{p3_count}}
  new_skills_needed: {{new_skills_count}}
  skill_improvements_needed: {{improvement_count}}
  existing_untested: {{untested_count}}
progress:
  specification: {{spec_pct}}
  scaffold: {{scaffold_pct}}
  production: {{production_pct}}
  tests: {{tests_pct}}
---

# {{title}}

> Date: {{date}}
> jaan-to Version: {{jaan_to_version}}
> Cycle: {{cycle_number}}
> Previous: {{previous_report_ref}}

---

## Executive Summary

{{executive_summary}}

---

## Section A — Current State

{{current_state_intro}}

### Implementation Progress

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
{{progress_rows}}
| **Overall** | **{{spec_pct}}%** | **{{scaffold_pct}}%** | **{{production_pct}}%** | **{{tests_pct}}%** |

### Existing Deliverables ({{deliverable_count}})

| Deliverable | Cycle | Skill | Key Metric |
|-------------|-------|-------|------------|
{{deliverable_rows}}

---

## Section B — Launch & GTM Gap Analysis

{{gap_analysis_content}}

---

## Section C — Summary Table

| Priority | Gap ID | Gap | Exists in jaan-to? | Blocks |
|----------|--------|-----|---------------------|--------|
{{summary_rows}}

**Skills that need to be created:** {{new_skills_count}} ({{new_skills_list}})
**Skills that need improvement:** {{improvement_count}} ({{improvement_list}})
**Skills that exist but are blocked/untested:** {{untested_count}} ({{untested_list}})

---

## Section D — Critical Path

```
{{critical_path_diagram}}
```

{{critical_path_explanation}}

---

## Section E — Cycle-Over-Cycle Delta

{{delta_content}}

---

## Section F — Recommendations for Cycle {{next_cycle}}

### Immediate Actions

{{immediate_actions}}

### Priority Order

| Step | Action | Unblocks |
|------|--------|----------|
{{priority_order_rows}}

---

## Metadata

| Field | Value |
|-------|-------|
| Created | {{date}} |
| Output Path | {{env:JAAN_OUTPUTS_DIR}}/gaps/{{id}}-launch-readiness-cycle-{{cycle_number}}/ |
| Skill | skill-gaps-critical |
| Version | 3.0 |
| Status | {{status}} |

---

> **Bottom line:** {{bottom_line}}