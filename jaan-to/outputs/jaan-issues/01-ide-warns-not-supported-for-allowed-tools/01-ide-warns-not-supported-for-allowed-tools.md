---
title: "[Bug] IDE warns \"not supported\" for custom skill frontmatter attributes"
type: "bug"
label: "bug"
repo: "parhumm/jaan-to"
issue_url: ""
issue_number: null
date: "2026-02-11"
jaan_to_version: "6.0.0"
os: "Darwin 25.1.0 arm64"
related_skill: "All skills"
generated_by: "jaan-issue-report"
session_context: true
---

## Description

The VSCode Claude Code extension shows warnings for jaan-to's custom YAML frontmatter attributes in SKILL.md files. The IDE validator only recognizes `compatibility`, `description`, `license`, `metadata`, `name` as valid attributes, but jaan-to skills use `allowed-tools`, `argument-hint`, and `user-invocable` which are core to the skill system.

**Note:** It's unclear whether this is a jaan-to issue (should register/declare custom attributes with the IDE) or a Claude Code extension issue (should not warn on unknown frontmatter). Filing here for the jaan-to team to review and decide.

## Steps to Reproduce

1. Open any jaan-to SKILL.md file in VSCode with the Claude Code extension
2. The file uses custom frontmatter attributes: `allowed-tools`, `argument-hint`, `user-invocable`
3. Observe IDE diagnostic warnings on those lines

## Expected Behavior

No warnings for valid jaan-to frontmatter attributes. The IDE should either recognize these attributes or not flag unknown attributes as warnings.

## Actual Behavior

Three warnings appear on every skill file:

```
Attribute 'allowed-tools' is not supported in skill files. Supported: compatibility, description, license, metadata, name.
Attribute 'argument-hint' is not supported in skill files. Supported: compatibility, description, license, metadata, name.
Attribute 'user-invocable' is not supported in skill files. Supported: compatibility, description, license, metadata, name.
```

These warnings appear on every edit, creating noise during skill development.

## Environment

| Field | Value |
|-------|-------|
| jaan-to version | 6.0.0 |
| OS | Darwin 25.1.0 arm64 |
| Related skill | All skills (affects any SKILL.md with custom frontmatter) |

## Additional Context

- Warnings are cosmetic only — they don't block skill execution
- The warnings persist across all skill files, not just specific ones
- Possible solutions: (1) jaan-to declares a frontmatter schema the IDE can consume, (2) the Claude Code extension allows unknown attributes, (3) this is forwarded to the Claude Code team as a feature request

---

**Reported via:** `jaan-issue-report` skill
**jaan-to version:** 6.0.0
**Session context used:** true
