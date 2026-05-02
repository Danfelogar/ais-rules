# ais-rules

A centralized repository for configuring and managing AI coding assistants across different tools and workflows.

## Purpose

This project provides rules, configurations, and guidelines for working with AI-powered development tools, ensuring consistent behavior and best practices across your team.

Without structured rules, AI coding agents default to the shortest path: they write code without a spec, skip tests, ignore security reviews, and produce prototype-quality output instead of production-ready software. This repo fixes that by giving each tool a set of opinionated, process-driven workflows — called **Agent Skills** — that encode the discipline senior engineers bring to every phase of a project.

---

## What Are Agent Skills?

Agent Skills are structured workflows that an AI coding assistant follows step-by-step, instead of just generating code and hoping for the best. Each skill covers one phase of the development lifecycle and includes:

- **A step-by-step process** with checkpoints and exit criteria
- **Anti-rationalization tables** — documented rebuttals to common excuses like *"I'll add tests later"* or *"this is too small to need a spec"*
- **Verification requirements** — the skill doesn't complete until there is concrete evidence (tests passing, build output, runtime data). *"Seems right"* is never sufficient

Skills activate automatically based on what you're doing. If you're designing an API, `api-and-interface-design` kicks in. If you're touching UI, `frontend-ui-engineering` activates. You can also trigger them explicitly with slash commands.

---

## The Development Lifecycle

Skills map directly to the six phases of production software development:

```
  DEFINE          PLAN           BUILD          VERIFY         REVIEW          SHIP
 ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐
 │ Idea │ ───▶ │ Spec │ ───▶ │ Code │ ───▶ │ Test │ ───▶ │  QA  │ ───▶ │  Go  │
 │Refine│      │  PRD │      │ Impl │      │Debug │      │ Gate │      │ Live │
 └──────┘      └──────┘      └──────┘      └──────┘      └──────┘      └──────┘
  /spec          /plan          /build        /test         /review       /ship
```

### The 7 Slash Commands

| Command | Phase | What the agent does |
|---|---|---|
| `/spec` | Define | Writes a PRD — objectives, structure, code style, test strategy, out-of-scope items — **before touching code** |
| `/plan` | Plan | Decomposes the spec into small, verifiable tasks with acceptance criteria and dependency ordering |
| `/build` | Build | Implements one thin vertical slice at a time — feature flagged, rollback-friendly, committed after each passing slice |
| `/test` | Verify | Runs Red-Green-Refactor, enforces the test pyramid (80% unit / 15% integration / 5% E2E), applies the Beyonce Rule |
| `/review` | Review | Five-axis review (correctness, security, readability, performance, maintainability), change sizing ~100 lines, severity labels |
| `/code-simplify` | Review | Applies Chesterton's Fence and the Rule of 500 to reduce complexity without changing behavior |
| `/ship` | Ship | Pre-launch checklist, feature flag lifecycle, staged rollout, rollback procedures, monitoring setup |

### The 20 Skills

Skills are the engine underneath the commands. Each one is a `SKILL.md` file with a workflow, red flags, and verification requirements.

**Define**
- `idea-refine` — structured divergent/convergent thinking to turn vague concepts into concrete proposals
- `spec-driven-development` — write the PRD before any code exists

**Plan**
- `planning-and-task-breakdown` — decompose specs into atomic tasks with acceptance criteria and dependency order

**Build**
- `incremental-implementation` — thin vertical slices, safe defaults, feature flags, commit-as-save-point
- `test-driven-development` — Red-Green-Refactor, DAMP over DRY, the Beyonce Rule, test pyramid
- `context-engineering` — feed the agent the right information at the right time; rules files, CLAUDE.md, MCP integrations
- `source-driven-development` — every framework decision must be grounded in official documentation with citations
- `frontend-ui-engineering` — component architecture, design systems, state management, WCAG 2.1 AA accessibility
- `api-and-interface-design` — contract-first design, Hyrum's Law, One-Version Rule, error semantics

**Verify**
- `debugging-and-error-recovery` — five-step triage: Reproduce → Localize → Reduce → Fix → Guard; stop-the-line rule
- `browser-testing-with-devtools` — live runtime data via Chrome DevTools MCP: DOM inspection, network traces, performance profiles

**Review**
- `code-review-and-quality` — five-axis review, change sizing, severity labels (Nit / Optional / FYI / must-fix)
- `code-simplification` — Chesterton's Fence, Rule of 500, preserve exact behavior while reducing complexity
- `security-and-hardening` — OWASP Top 10 prevention, auth patterns, secrets management, three-tier boundary system
- `performance-optimization` — measure-first, Core Web Vitals targets, profiling workflows, anti-pattern detection

**Ship**
- `git-workflow-and-versioning` — trunk-based development, atomic commits, conventional commit format
- `ci-cd-and-automation` — Shift Left principle, Faster is Safer, quality gate pipelines, failure feedback loops
- `deprecation-and-migration` — code-as-liability mindset, compulsory vs advisory deprecation, zombie code removal
- `documentation-and-adrs` — Architecture Decision Records, API docs, inline documentation standards (document the *why*)
- `shipping-and-launch` — pre-launch checklists, feature flag lifecycle, staged rollouts, rollback procedures

---

## Why This Matters

Most teams already know what good engineering looks like. The problem is that AI agents, left to their own defaults, skip most of it. Agent Skills makes the right process the path of least resistance — the agent follows the same workflow a staff engineer would, because that workflow is baked directly into how the tool operates.

Key principles embedded across all skills (drawn from Google's engineering culture and *Software Engineering at Google*):

| Principle | Where it appears |
|---|---|
| Hyrum's Law | `api-and-interface-design` — any observable behavior will be depended on |
| The Beyonce Rule | `test-driven-development` — if you liked it, you should have put a test on it |
| Chesterton's Fence | `code-simplification` — understand why something exists before removing it |
| Shift Left | `ci-cd-and-automation` — catch errors at PR time, not in production |
| Faster is Safer | `shipping-and-launch` — small, frequent releases are less risky than large ones |
| Code as Liability | `deprecation-and-migration` — every line you keep is a line you maintain |

---

## Tools Covered

| Tool | Description |
|---|---|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) | Anthropic's agentic coding assistant for the terminal |
| [OpenAI Codex CLI](https://github.com/openai/codex) | OpenAI's command-line coding assistant |
| [Cursor](https://www.cursor.com/) | AI-powered code editor |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | Google's Gemini assistant for the terminal |

## Repository Structure

```
ais-rules/
├── claude-code/        # Rules and config for Claude Code
├── codex/              # Rules and config for OpenAI Codex CLI
├── cursor/             # Rules and config for Cursor
└── gemini/             # Rules and config for Gemini CLI
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/ais-rules.git
```

2. Navigate to the tool you want to configure and follow the instructions in its folder.

3. For Claude Code, install Agent Skills directly:
```bash
# Via marketplace (recommended)
/plugin marketplace add addyosmani/agent-skills
/plugin install agent-skills@addy-agent-skills

# Or clone locally and point Claude at it
git clone https://github.com/addyosmani/agent-skills.git
claude --plugin-dir /path/to/agent-skills
```

## Contributing

Feel free to open a PR to add new rules, improve existing ones, or add support for additional AI tools.

Skills should be: **specific** (actionable steps, not vague advice), **verifiable** (clear exit criteria with evidence requirements), **battle-tested** (based on real workflows), and **minimal** (only what's needed to guide the agent).

## License

MIT