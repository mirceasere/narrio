# Research Brief

Research Agent. Produces a prioritized topic backlog and detailed content briefs from customer intelligence.

## Trigger

User invokes `/research-brief`.

## Context Consumed

- `strategy/icp.md` -- audience definition and firmographic filters
- `strategy/personas.md` -- persona pain mapping and messaging
- `strategy/competitive-landscape.md` -- competitive gaps and positioning opportunities
- `customer-intelligence/insights/*.json` -- all structured insight files
- `customer-intelligence/transcripts/` -- optional, for additional context mining

Does NOT read: `positioning.md`, `voice-guide.md`, `knowledge-base.md`, or `proof-library/`.

## Input

- None required. The skill reads all available intelligence files.
- Optional `$ARGUMENTS`: a specific focus area or persona filter (e.g., "security persona only" or "comparison content").

## Output

- `outputs/briefs/topic-backlog.json` -- prioritized topic list
- `outputs/briefs/[topic-slug]_brief.json` -- detailed brief for each top topic

## Workflow

### Step 1: Load context

Read these files (skip any that do not exist, but warn):
1. `strategy/icp.md`
2. `strategy/personas.md`
3. `strategy/competitive-landscape.md`

### Step 2: Load intelligence

1. Read all `.json` files in `customer-intelligence/insights/`.
2. If no insight files exist, check `customer-intelligence/transcripts/` for raw transcripts.
3. If neither exists, stop and tell the user: "No customer intelligence found. Run /extract-insights on your sales call transcripts first, or drop insight JSON files into customer-intelligence/insights/."

### Step 3: Aggregate intelligence

Across all insight files, aggregate:
- All keyword candidates (deduplicate, merge scores from multiple calls)
- All pains (cluster by theme, count frequency across calls)
- All JTBD (cluster by similarity)
- All lexicon terms (merge and deduplicate)
- All competitor mentions (count frequency, track sentiment patterns)

### Step 4: Build topic backlog

Generate topic candidates in four categories using pain-point SEO methodology:

**Category keywords:** Core terms the buyer uses to describe the problem space.
**Comparison and alternatives:** "[Competitor] vs [You]", "[Competitor] alternatives", "best [category] tools".
**JTBD queries:** How-to and process queries derived from jobs to be done.
**Deviant terms:** Non-obvious terms from customer lexicon that competitors are not targeting.

For each topic candidate, score on six dimensions:

| Dimension | Weight | Score Range | What It Measures |
|-----------|--------|-------------|-----------------|
| Buyer intent | 35% | 0-10 | Does this query indicate purchase consideration? |
| Differentiator fit | 20% | 0-10 | Can we credibly differentiate on this topic? |
| SERP weakness | 15% | 0-10 | Is the current ranking content weak or generic? |
| Business priority | 10% | 0-10 | Does this align with current business goals? |
| Mini-volume | 10% | 0-10 | Is there enough search volume to justify the effort? |
| Authority fit | 10% | 0-10 | Do we have credible expertise and proof on this topic? |

Calculate weighted total for each. Sort descending.

**Note on SERP weakness:** If the Firecrawl MCP server is available, use `firecrawl_search` to check current SERP results for top keyword candidates. If Firecrawl is not available, estimate SERP weakness based on the topic type (comparison keywords typically have weaker SERPs than category keywords) and note that SERP analysis would improve accuracy.

### Step 5: Write topic backlog

Write `outputs/briefs/topic-backlog.json`:

```json
{
  "generated_date": "ISO date",
  "intelligence_sources": ["list of insight files consumed"],
  "filter_applied": "string or null",
  "topics": [
    {
      "topic_id": "string -- slug",
      "title": "string -- working title",
      "category": "string -- category, comparison, jtbd, deviant",
      "primary_keyword": "string",
      "persona": "string -- primary target persona",
      "pain_cluster": "string -- which pain theme this addresses",
      "priority_score": {
        "buyer_intent": 0,
        "differentiator_fit": 0,
        "serp_weakness": 0,
        "business_priority": 0,
        "mini_volume": 0,
        "authority_fit": 0,
        "weighted_total": 0
      },
      "brief_status": "string -- pending, generated"
    }
  ]
}
```

### Step 6: Generate content briefs for top topics

For the top 3-5 topics (or as specified by user), produce a detailed content brief. Write each as `outputs/briefs/[topic-slug]_brief.json`:

```json
{
  "meta": {
    "topic_id": "string",
    "priority_score": 0,
    "stage": "string -- tofu, mofu, bofu",
    "format": "string -- guide, comparison, how-to, case-study, listicle",
    "target_word_count": 0,
    "estimated_effort": "string -- 1-2 hours, 2-4 hours, etc."
  },
  "keyword": {
    "primary": "string",
    "variants": ["array of related keywords"],
    "searcher_intent": "string -- what the searcher wants to accomplish"
  },
  "audience": {
    "persona": "string",
    "industry_focus": "string or null",
    "pain_summary": "string -- the core pain this content addresses",
    "awareness_level": "string -- unaware, problem-aware, solution-aware, product-aware"
  },
  "angle": "string -- the specific angle that differentiates this from existing content",
  "thesis_sentence": "string -- one sentence capturing the core argument",
  "outline": [
    {
      "section": "string -- H2 heading",
      "notes": "string -- what to cover in this section",
      "word_target": 0,
      "evidence_needed": "string -- what proof points to include"
    }
  ],
  "value_props_to_weave": [
    {
      "pain": "string -- the customer pain",
      "prop": "string -- the value proposition that addresses it",
      "proof": "string -- specific evidence (metric, case study, quote)"
    }
  ],
  "originality_nuggets": [
    "string -- unique insights from customer intelligence that no competitor has"
  ],
  "seo": {
    "title_tag": "string -- under 60 characters",
    "meta_description": "string -- under 155 characters",
    "url_slug": "string"
  },
  "aeo_directives": {
    "featured_snippet_target": "string -- the question this should answer in position zero",
    "definition_paragraph": "string -- first-paragraph definition for AEO compliance",
    "faq_questions": ["array of FAQ questions to include as structured data"]
  }
}
```

### Step 7: Report

Print a summary:
- Total topics generated (with count by category)
- Top 5 topics with scores
- Briefs generated (with file paths)
- Gaps noted: personas with no topics, pain clusters without coverage
- If Firecrawl was unavailable, note that SERP analysis was estimated
