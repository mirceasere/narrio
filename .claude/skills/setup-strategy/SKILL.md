# Setup Strategy

Interactive strategy setup wizard. Builds the master knowledge base that powers every downstream skill.

## Trigger

User invokes `/setup-strategy`.

## Context Consumed

- `strategy/templates/` (read templates as structural guides)
- Does NOT consume any existing strategy context files

## Workflow

### Step 1: Check existing state

1. Check if `strategy/knowledge-base.md` exists.
2. If it exists, read the first 20 lines. If it contains real company data (not the template placeholder text), inform the user:
 - "You already have a knowledge base at strategy/knowledge-base.md. Running this wizard will overwrite it. Type 'continue' to proceed or 'cancel' to stop."
 - Wait for user confirmation before proceeding.
3. If it does not exist, or user confirms overwrite, proceed to Step 2.

### Step 2: Read templates

Read all template files from `strategy/templates/` to understand the structure:
- `knowledge-base-template.md` (master structure)
- `icp-template.md`
- `personas-template.md`
- `positioning-template.md`
- `voice-guide-template.md`
- `competitive-template.md`

If templates directory is empty or missing, use the structure from `strategy/examples/knowledge-base.md` as a reference. If neither templates nor examples exist, use the following master sections:
1. Company Overview (mission, product, category, stage)
2. Ideal Customer Profile (firmographics, dream customer, buying committee, external signals)
3. Buyer Personas (per-persona: role, goals, pains, decision criteria, objections, messaging)
4. Positioning (narrative arc, differentiators, proof points, alternatives framing)
5. Voice and Style Guide (tone, vocabulary, anti-patterns, prohibited terms, content principles)
6. Competitive Landscape (competitor mapping, battlecards, positioning gaps)

### Step 3: Interactive walkthrough

Walk the user through building each section of the knowledge base. For each section:

1. Explain what the section captures and why it matters.
2. Ask focused questions. Do NOT dump all questions at once. Ask 2-3 questions per turn, wait for answers.
3. After each section, summarize what you captured and confirm accuracy before moving on.
4. If the user says "skip" for any section, leave a `<!-- TODO -->` placeholder.

**Section order and key questions:**

**Company Overview:**
- What does your company do in one sentence?
- What product/service do you sell? What category does it fall into?
- What stage are you at (pre-revenue, early, growth, scale)?
- What is the primary business model?

**Ideal Customer Profile:**
- Who is your best-fit customer? (Industry, company size, geography)
- Describe your dream customer. What makes them ideal?
- Who is on the buying committee? (Decision maker, champion, influencer, blocker)
- What external signals indicate a company is ready to buy?

**Buyer Personas (repeat for each persona):**
- What is this person's role and title?
- What are their top 3 goals?
- What are their top 3 pain points related to your category?
- What criteria do they use to evaluate solutions?
- What objections do they raise?
- What messaging resonates with them?

**Positioning:**
- What is the core narrative? (From pain to solution to outcome)
- What are your 3 key differentiators? For each: claim, proof, and why it matters.
- How do you frame alternatives? (Spreadsheets, manual processes, competitors)

**Voice and Style:**
- How should your content sound? (Formal/casual, technical/accessible, authoritative/conversational)
- What words or phrases should always be used?
- What words or phrases are prohibited?
- What content principles guide your team?

**Competitive Landscape:**
- Who are your top 3-5 competitors?
- For each: what is their positioning? Where are they strong? Where are they weak?
- What positioning gaps exist that you can own?

### Step 4: Assemble and write

1. Compile all answers into a complete `strategy/knowledge-base.md` following the template structure.
2. Write the file.
3. Confirm to the user: "Master knowledge base written to strategy/knowledge-base.md."

### Step 5: Auto-run sync-context

1. Immediately invoke the `sync-context` skill to derive all module files.
2. This produces: `strategy/icp.md`, `strategy/personas.md`, `strategy/positioning.md`, `strategy/voice-guide.md`, `strategy/competitive-landscape.md`.

### Step 6: Confirm and suggest next steps

Report to the user:
- Files created (master + derived modules)
- Any sections that were skipped (marked with TODO)
- Suggested next steps:
 - "Drop sales call transcripts into customer-intelligence/transcripts/ and run /extract-insights"
 - "Add case studies to proof-library/case-studies/"
 - "Edit strategy/knowledge-base.md directly and run /sync-context to update modules"

## Output

- `strategy/knowledge-base.md` (master knowledge base)
- All derived module files via sync-context
