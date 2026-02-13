---
title: "[Feature] i18n setup skill — wire translation frameworks from microcopy outputs"
type: "feature"
label: "enhancement"
repo: "parhumm/jaan-to"
issue_url: "https://github.com/parhumm/jaan-to/issues/80"
issue_number: 80
date: "2026-02-13"
jaan_to_version: "6.1.0"
os: "Darwin 25.1.0 arm64"
related_skill: "ux-microcopy-write, detect-writing"
generated_by: "gaps-critical-issue"
session_context: true
---

## Problem

`ux-microcopy-write` generates excellent multi-language microcopy packs, but no skill wires them into an actual i18n framework. [Jaanify](https://github.com/parhumm/jaanify) has 7-language packs sitting unused with i18n maturity Level 0. Gap open for 4 cycles (L-07, P2).

## What's Needed

A skill that generates: framework setup (next-intl/react-i18next), translation file conversion, string extraction, language switcher component, RTL support, and locale detection middleware.

## What Already Exists

- `ux-microcopy-write` generates the input content
- `detect-writing` identifies hardcoded strings (~55 in Jaanify)
- `frontend-scaffold` generates components that i18n would integrate with

## Related Skills

- `ux-microcopy-write` — generates content this skill consumes
- `detect-writing` — identifies i18n maturity and hardcoded strings
- `frontend-scaffold` — generates components to modify with translations

## Environment

| Field | Value |
|-------|-------|
| jaan-to version | 6.1.0 |
| Gap ID | L-07 |
| Priority | P2 (GTM Essential) |
| Upstream | https://github.com/parhumm/jaanify/issues/2 |

---

**Reported via:** `gaps-critical-issue` skill
**jaan-to version:** 6.1.0
**Upstream issue:** https://github.com/parhumm/jaanify/issues/2
