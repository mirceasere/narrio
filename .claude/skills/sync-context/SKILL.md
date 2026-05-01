# Sync Context

Reads the master knowledge base and produces or updates all derived module files. Run this after any edit to `strategy/knowledge-base.md`.

## Trigger

User invokes `/sync-context`, or called automatically by `setup-strategy` after creating the master knowledge base.

## Context Consumed

- `strategy/knowledge-base.md` (reads the master, this is the sole input)

## Output

Writes or updates these derived files in `strategy/`:
- `icp.md`
- `personas.md`
- `positioning.md`
- `voice-guide.md`
- `competitive-landscape.md`

## Workflow

### Step 1: Validate master exists

1. Check if `strategy/knowledge-base.md` exists.
2. If it does not exist, stop and tell the user: "No master knowledge base found at strategy/knowledge-base.md. Run /setup-strategy to create one."
3. Read the full contents of `strategy/knowledge-base.md`.

### Step 2: Check for templates

Read any available template files from `strategy/templates/` to use as structural guides for the derived files:
- `icp-template.md`
- `personas-template.md`
- `positioning-template.md`
- `voice-guide-template.md`
- `competitive-template.md`

If templates exist, use them as the structural scaffold. If not, use the section structure from the master knowledge base directly.

### Step 3: Extract and derive each module

For each derived file, extract the relevant sections from the master knowledge base:

**icp.md** -- Extract from the Ideal Customer Profile section:
- Firmographic filters (industry, company size, geography, tech stack)
- Dream customer description
- Buying committee roles and dynamics
- External buying signals
- Disqualification criteria (if present)

**personas.md** -- Extract from the Buyer Personas section:
- Each persona as a self-contained profile
- Role, title, reporting line
- Goals, KPIs, daily reality
- Pain points with triggers and costs
- Decision criteria and evaluation process
- Common objections with responses
- Messaging that resonates

**positioning.md** -- Extract from the Positioning section:
- Core narrative arc (pain to solution to outcome)
- Key differentiators with claim, proof, and significance
- Alternatives framing (how you position against status quo and competitors)
- Value propositions with supporting proof points
- Category definition (how you define the space)

**voice-guide.md** -- Extract from the Voice and Style section:
- Tone description and spectrum
- Vocabulary: preferred terms and prohibited terms
- Sentence structure preferences
- Content principles
- Anti-patterns to avoid
- Formatting conventions

**competitive-landscape.md** -- Extract from the Competitive Landscape section:
- Competitor profiles (positioning, strengths, weaknesses)
- Battlecard summaries
- Positioning gaps and opportunities
- Win/loss patterns (if present)

### Step 4: Diff and update

For each derived file:

1. If the file already exists, read its current contents.
2. Compare the newly derived content against existing content.
3. If there are changes, write the updated file.
4. Track what changed (new sections added, sections updated, sections removed).

If the file does not exist, create it.

### Step 5: Report

Print a change report with this format:

```
Sync complete. Changes:

  icp.md              [created | updated | no changes]
  personas.md         [created | updated | no changes]
  positioning.md      [created | updated | no changes]
  voice-guide.md      [created | updated | no changes]
  competitive-landscape.md  [created | updated | no changes]

Updated sections:
  - personas.md: Added new persona "Security Lead"
  - positioning.md: Updated differentiator #2 proof point
  - [etc.]
```

If all files were created fresh (first run), say:
```
Sync complete. All 5 derived modules created from master knowledge base.
```
