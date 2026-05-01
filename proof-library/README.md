# Proof Library

## Organizing Case Studies and Proof Points

Every positioning claim needs a number behind it. The proof library is where you collect, structure, and maintain the evidence that makes your GTM messaging credible.

## Case Study Structure

Each case study in `case-studies/` should include:

| Section | What to Capture |
|---|---|
| **Company Context** | Industry, size, stage -- anonymized if needed (e.g., "Series B fintech, 200 employees") |
| **Challenge** | The specific problem they faced, in their language |
| **Solution** | What they implemented and how -- tied to your product's capabilities |
| **Metrics** | Specific, quantified outcomes (e.g., "reduced onboarding time from 6 weeks to 4 days") |
| **Customer Quote** | A direct quote that captures the emotional or business impact |

## How Proof Gets Used

Case studies are mined by the enrichment stage of the SEO content pipeline. When an article draft references a value proposition, the enrichment agent pulls matching proof points to substantiate the claim.

The proof library maps directly to your value propositions:

```
Value Prop: "Reduce compliance audit prep from weeks to hours"
  → Case Study: Series B fintech cut prep time by 92%
  → Case Study: Enterprise healthcare org eliminated 3 FTE of manual work
  → Metric: Average customer sees ROI in 47 days
```

Every claim in your positioning should trace back to at least one proof point here. If it doesn't, either find the proof or soften the claim.

## Reference

- **`examples/`** -- Sample case studies showing the expected format, level of detail, and how metrics should be presented.
- **`case-studies/`** -- Your case studies go here, one file per customer story.
