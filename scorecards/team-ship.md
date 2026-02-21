# Scorecard: team-ship

> Tested: 2026-02-20 | jaan-to v7.2.0 (SHA: 3c10276) | Cycle 13
> Skill version: v7.1.0 (added), v7.2.0 (refined)
> First test — no previous baseline

---

## Score: 3.6 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 3/5 | Team creation + spawn works. PM hit WebSearch permission wall — lead had to take over. Backend + Frontend teammates produced quality output. QA/DevOps phases not fully exercised. |
| Output Quality | 25% | 4/5 | Orchestration log, checkpoint.yaml, and teammate outputs are well-structured. 8 files, ~2200 lines of scaffold. Backend found existing cookie helpers (good context awareness). |
| Context Awareness | 20% | 4/5 | Roles.md correctly filtered for fast track. Brownfield adaptation worked when prompted. Reference docs comprehensive. |
| Learning Integration | 15% | 3/5 | LEARN.md exists with useful lessons. But skill doesn't yet handle permission delegation for spawned agents. No adaptive behavior when PM got stuck. |
| Workflow Efficiency | 10% | 3/5 | Phase 1 stalled on permissions. Lead intervention required. Parallel Phase 2 worked well. Team cleanup required manual shutdown requests. |

---

## Strengths

1. **Comprehensive role catalog**: roles.md covers 7 build roles + 5 detect roles with clear skill chains, phases, and dependencies
2. **Parallel execution works**: Backend + Frontend ran simultaneously and produced independent, coherent outputs
3. **Reference architecture is solid**: Spawn prompt templates, dependency graph algorithm, checkpoint schema are well-designed
4. **Track system is flexible**: Fast/full/detect/custom tracks provide good granularity
5. **Checkpoint enables resume**: YAML schema allows resuming interrupted orchestrations

## Issues

1. **Permission delegation broken**: Spawned PM agent couldn't use WebSearch — each search required user approval. This defeats the purpose of autonomous orchestration.
2. **No fallback for stuck agents**: When PM was blocked, team-ship had no built-in recovery. Lead had to manually take over.
3. **Greenfield bias**: Skill assumes new project. No brownfield-specific prompts for adding features to existing codebases. Spawn prompts needed manual adaptation.
4. **Team cleanup friction**: TeamDelete fails if any agents are active. Shutdown requests are async — need to wait for each agent to respond.
5. **All agents used opus model**: roles.md specifies `sonnet` for Build roles but actual spawns used `opus` (model inheritance issue with the team framework).

## Gaps Discovered

- **G-TS-01**: Need permission pre-authorization for spawned agents (WebSearch, Bash, etc.)
- **G-TS-02**: Need brownfield mode (`--brownfield`) that reads existing codebase and generates delta scaffolds
- **G-TS-03**: Need stuck-agent recovery protocol (timeout → lead takeover → resume)
- **G-TS-04**: Need model specification enforcement (sonnet for build, haiku for detect)
- **G-TS-05**: Need integrated QA flow that works with scaffold-only output (before dev-output-integrate)
