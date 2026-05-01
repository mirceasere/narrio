# Extract Insights

Grow and Convert Call Analyzer. Takes a sales call transcript and extracts structured pain-point SEO intelligence.

## Trigger

User invokes `/extract-insights` with an optional transcript file path as argument.

## Context Consumed

- `strategy/icp.md` -- classify buyer roles and company fit
- `strategy/personas.md` -- tag speaker by persona, map pains to known persona pains
- `strategy/competitive-landscape.md` -- identify and contextualize competitor mentions

Does NOT read: `positioning.md`, `voice-guide.md`, `knowledge-base.md`, or any outputs.

## Input

- `$ARGUMENTS` -- path to a transcript file (e.g., `customer-intelligence/transcripts/acme-2026-04-15.md`)
- If no argument provided, list all files in `customer-intelligence/transcripts/` and ask the user to select one.
- If the transcripts directory is empty, tell the user: "No transcripts found. Drop a sales call transcript into customer-intelligence/transcripts/ and run this skill again."

## Output

- `customer-intelligence/insights/[company]_[date]_insights.json`
- If the `customer-intelligence/insights/` directory does not exist, create it.

## Workflow

### Step 1: Load transcript

1. Read the transcript file specified by the user (or selected interactively).
2. Validate it contains conversational content (speaker labels, dialogue). If it looks like a different file type, warn the user.

### Step 2: Load context

Read these three files (skip any that do not exist, but warn):
- `strategy/icp.md`
- `strategy/personas.md`
- `strategy/competitive-landscape.md`

### Step 3: Extract structured intelligence

Analyze the transcript and produce a JSON object with these fields:

```json
{
  "call_meta": {
    "company": "string -- company name from transcript",
    "persona": "string -- best-fit persona from personas.md",
    "industry": "string",
    "company_size": "string -- employee range or revenue range",
    "deal_stage": "string -- discovery, evaluation, negotiation, closed, churned",
    "call_date": "string -- ISO date if discernible, else null",
    "participants": ["array of speaker names/roles"]
  },
  "jtbd": [
    {
      "job": "string -- what the buyer is trying to accomplish",
      "desired_outcome": "string -- what success looks like",
      "current_approach": "string -- how they do it today"
    }
  ],
  "pains": [
    {
      "pain": "string -- the specific pain point",
      "trigger": "string -- what event or condition surfaces this pain",
      "cost": "string -- quantified or described impact",
      "urgency": "string -- low, medium, high, critical",
      "verbatim": "string -- direct quote if available"
    }
  ],
  "workflow_reality": {
    "current_process": "string -- step-by-step of how they do it today",
    "tools_used": ["array of tools/systems mentioned"],
    "brittleness": "string -- where the process breaks down",
    "workarounds": ["array of manual workarounds they use"]
  },
  "alternatives_and_competitors": [
    {
      "name": "string -- competitor or alternative mentioned",
      "type": "string -- direct_competitor, adjacent_tool, manual_process, status_quo",
      "sentiment": "string -- positive, negative, neutral, mixed",
      "context": "string -- what was said about it",
      "known_competitor": "boolean -- true if this matches an entry in competitive-landscape.md"
    }
  ],
  "quotes": [
    {
      "text": "string -- the verbatim quote",
      "speaker": "string -- who said it (role, not name)",
      "context": "string -- what prompted this statement",
      "themes": ["array of theme tags"]
    }
  ],
  "lexicon": {
    "category_terms": ["words the buyer uses to describe the problem space"],
    "value_language": ["words the buyer uses to describe desired outcomes"],
    "deviant_terms": ["unexpected or non-obvious terms worth noting for SEO"]
  },
  "keyword_candidates": [
    {
      "keyword": "string",
      "type": "string -- category, comparison, jtbd, deviant, long_tail",
      "source_context": "string -- where in the call this surfaced",
      "priority_score": {
        "buyer_intent": "0-10 (weight: 35%)",
        "differentiator_fit": "0-10 (weight: 20%)",
        "serp_weakness": "0-10 (weight: 15%)",
        "business_priority": "0-10 (weight: 10%)",
        "mini_volume": "0-10 (weight: 10%)",
        "authority_fit": "0-10 (weight: 10%)",
        "weighted_total": "number -- calculated weighted score"
      }
    }
  ]
}
```

### Step 4: Score keyword candidates

For each keyword candidate, calculate the weighted total:
- `weighted_total = (buyer_intent * 0.35) + (differentiator_fit * 0.20) + (serp_weakness * 0.15) + (business_priority * 0.10) + (mini_volume * 0.10) + (authority_fit * 0.10)`

Sort keyword_candidates by weighted_total descending.

### Step 5: Apply anonymization

Before writing the output:
- Keep: role titles, industry, company size range, deal stage
- Remove: individual names (replace with role), company name (keep in call_meta but anonymize in quotes)
- Keep competitor names as-is (these are public entities)

### Step 6: Write output

1. Determine the output filename: `[company]_[date]_insights.json`
 - Use the company name from call_meta (lowercase, hyphens for spaces)
 - Use the call date if available, otherwise today's date
 - Example: `acme-corp_2026-04-15_insights.json`
2. Write to `customer-intelligence/insights/`
3. Confirm to the user with a summary:
 - Persona identified
 - Number of pains extracted
 - Number of keyword candidates (with top 3 listed)
 - Number of quotes captured
 - Output file path
