# Strategy: Modular Context Architecture

## How It Works

The strategy layer uses a **master knowledgebase + derived modules** pattern to keep AI agents focused and accurate.

### Source of Truth

`knowledge-base.md` is the single master knowledgebase. It contains everything: your ICP definition, buyer personas, positioning, voice guidelines, and competitive landscape -- all in one place. You edit here and only here.

### Derived Modules

Agents don't consume the full knowledgebase. Instead, they pull from scoped extracts:

| Module | Purpose |
|---|---|
| `icp.md` | Ideal customer profile definition -- firmographics, technographics, qualifying signals |
| `personas.md` | Buyer personas with roles, motivations, objections, and language patterns |
| `positioning.md` | Value propositions, differentiation claims, and messaging hierarchy |
| `voice-guide.md` | Tone, vocabulary, sentence patterns, and anti-patterns for content generation |
| `competitive-landscape.md` | Competitor positioning, strengths/weaknesses, and differentiation angles |

Each module is a projection of the master -- scoped to what a specific agent needs, nothing more.

### The Cascade Principle

The update flow is one-directional:

```
Edit knowledge-base.md → Run sync-context → All derived modules update
```

Never edit derived modules directly. They are generated artifacts. If something is wrong in `icp.md`, fix it in `knowledge-base.md` and re-sync.

### Getting Started

- **`examples/`** -- A fully built example using a fictional company (ComplianceOS). Read this first to see the expected depth and structure of a completed knowledgebase and its derived modules.
- **`templates/`** -- Guided templates with prompts and placeholders to build your own knowledgebase from scratch. Start here when setting up for a new company.

### Why This Architecture

Feeding an entire knowledgebase to every agent wastes context and introduces noise. A persona-targeting agent doesn't need competitive intelligence. A voice calibration agent doesn't need firmographic data. Scoped modules mean agents get exactly what they need -- better outputs, lower cost, fewer hallucinations.
