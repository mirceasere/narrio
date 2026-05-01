# LinkedIn Insights

Extracts high-signal insights from call transcripts and intelligence files, then produces LinkedIn post draft structures.

## Trigger

User invokes `/linkedin-insights` with an optional file path as argument.

## Context Consumed

- `strategy/personas.md` -- persona-specific framing and pain mapping
- `strategy/positioning.md` -- positioning themes, differentiators, and value props

Does NOT read: `icp.md`, `voice-guide.md`, `competitive-landscape.md`, `knowledge-base.md`.

## Input

- `$ARGUMENTS` -- path to an insights JSON file or transcript (e.g., `customer-intelligence/insights/acme-corp_2026-04-15_insights.json`)
- If no argument provided, list all files in `customer-intelligence/insights/` and `customer-intelligence/transcripts/` and ask the user to select one.
- If no files exist in either directory, tell the user: "No intelligence files found. Run /extract-insights on a sales call transcript first."

## Output

- `outputs/linkedin/[source-slug]_linkedin-posts.md` -- collection of post drafts from this source
- If the `outputs/linkedin/` directory does not exist, create it.

## Workflow

### Step 1: Load context

Read these two files (skip any that do not exist, but warn):
1. `strategy/personas.md`
2. `strategy/positioning.md`

### Step 2: Load source material

Read the input file.

- If it is a `.json` insights file: extract pains, quotes, JTBD, keyword candidates, and workflow reality.
- If it is a transcript: scan for high-signal moments (strong emotional language, repeated pain points, competitor complaints, aha moments, quantified impacts).

### Step 3: Identify high-signal insights

Select insights that meet at least two of these criteria:
- **Emotional resonance:** The insight captures a genuine frustration, surprise, or realization.
- **Specificity:** It includes concrete details (numbers, process steps, tool names) rather than generalities.
- **Contrarian angle:** It challenges a common assumption in the industry.
- **Pattern match:** It echoes a pain or JTBD that appears across multiple calls (check other insight files if they exist).
- **Positioning alignment:** It naturally connects to a differentiator or value prop from `positioning.md`.

Aim for 3-6 post-worthy insights per source file. Quality over quantity.

### Step 4: Produce post drafts

For each selected insight, produce a draft structure:

```markdown
## Post [N]: [Working Title]

**Source:** [file name and relevant section]
**Target persona:** [from personas.md]
**Positioning theme:** [which differentiator or value prop this connects to]
**Hook type:** [contrarian, story, data, question, observation]

### Draft (80-150 words)

[The post draft itself. Written in founder voice: first-person, conversational, specific.
Opens with a hook that stops the scroll.
Body delivers the insight with concrete detail.
Closes with a perspective or question, not a CTA.
No hashtags in the draft.]

### Image concept

[Brief description of a supporting visual: screenshot mockup, simple diagram, stat callout, or "text only" if the post does not need an image.]

### Notes

[Any context for the user: why this insight matters, what reaction it might provoke, which comments to anticipate.]
```

**Writing rules for drafts:**
- First person, singular ("I" not "we").
- Specific over general. Replace "many companies struggle with" with "the compliance lead I talked to last week said."
- No corporate jargon. Write like you are talking to a smart friend.
- No em-dashes. Use periods, commas, or parentheses.
- No "leverage," "utilize," "seamless," "robust," or any term from the global anti-slop rules.
- No hashtags in the draft body. User adds their own.
- Length: 80-150 words. If the insight needs more, split into two posts.

### Step 5: Write output

1. Determine the output filename: `[source-slug]_linkedin-posts.md`
 - Use the source file name (without extension) as the slug.
 - Example: `acme-corp_2026-04-15_insights` becomes `acme-corp_2026-04-15_insights_linkedin-posts.md`
2. Write to `outputs/linkedin/`.
3. Report to the user:
 - Number of post drafts generated
 - For each: working title, target persona, positioning theme
 - Output file path
 - Reminder: "Review and edit these drafts before posting. They are starting points, not final copy."
