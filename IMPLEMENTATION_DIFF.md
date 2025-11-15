# Narrio SDR Deal Management - Implementation Diff

**Date:** November 15, 2025
**Status:** Initial Assessment

## Executive Summary

**Current State:** Empty repository with only a `todo.md` file
**Implementation Progress:** 0% (0 of 5 components implemented)

---

## Component-by-Component Analysis

### Component 1: Deals List - CRUD ❌ **NOT IMPLEMENTED**

**Missing Features:**
- ❌ Deals list view with columns (Company, Contact, Stage, Value, Last Activity, Next Actions)
- ❌ Search functionality across all deals
- ❌ Filter by deal stage, value range, activity date
- ❌ Sort by any column (ascending/descending)
- ❌ Create deal modal with required fields
- ❌ Auto-fill functionality (company from website, website from email)
- ❌ Import from HubSpot feature
- ❌ HubSpot data mapping and sync
- ❌ Read deal (navigation to detail view)
- ❌ Update deal functionality
- ❌ Delete deal (marked as "not in V1" but UI structure needed)
- ❌ HubSpot sync features (refresh icon, auto-sync)

**Status:** Not started

---

### Component 2: Deal Details ❌ **NOT IMPLEMENTED**

**Missing Features:**

#### Deal Header
- ❌ Deal header visible on all tabs
- ❌ Editable deal name
- ❌ Refresh icon for HubSpot-imported deals
- ❌ Company name display
- ❌ Stage dropdown (editable)
- ❌ Deal value ($ editable inline)
- ❌ Last contact date (read-only)
- ❌ Breadcrumb navigation

#### Tab Navigation
- ❌ 4-tab structure (Overview, Stakeholder Map, Deal Context, Generated Content)

#### Tab 1: Overview
- ❌ Card 1: Next Actions (AI-suggested + manual todos)
- ❌ Card 2: Who to Engage (stakeholder engagement status)
- ❌ Card 3: What to Ask (AI-generated discovery questions)
- ❌ Card 4: What Info to Give (AI-suggested talking points)
- ❌ Card 5: What Data to Add (missing data prompts)

#### Tab 2: Stakeholder Map
- ❌ Stakeholder table with CRUD operations
- ❌ Multi-select buyer type support
- ❌ LinkedIn profile integration
- ❌ Empty state handling

#### Tab 3: Deal Context
- ❌ Document list view (Email, Call, Note, Transcript, Other)
- ❌ Auto-sync from HubSpot
- ❌ Manual document upload
- ❌ View/download documents
- ❌ Remove documents (manual only)
- ❌ AI processing of documents

#### Tab 4: Generated Content
- ❌ Card-based list view of generated content
- ❌ Filter options (All, Meeting Prep, Email Sequence, Bundle)
- ❌ Sort options (Newest/Oldest first)
- ❌ Search functionality
- ❌ Delete content
- ❌ Editor view for all content types
- ❌ Save/Download/Copy/Regenerate actions

**Status:** Not started

---

### Component 3: Meeting Prep Generation Flow ❌ **NOT IMPLEMENTED**

**Missing Features:**
- ❌ "Prep for Next Meeting" button trigger
- ❌ Step 1: Stakeholder selection modal
- ❌ Step 2: Generation process with loading state
- ❌ Step 3: Delivery to editor view
- ❌ Meeting prep document structure and formatting
- ❌ AI-powered content generation based on:
  - Selected stakeholders
  - Company identity
  - Deal context documents
  - Discovery questions
  - Talking points
- ❌ Post-generation actions (edit, save, download, copy, regenerate)

**Status:** Not started

---

### Component 4: Content Generation Flow ❌ **NOT IMPLEMENTED**

**Missing Features:**
- ❌ Step 1: Select angle (3 AI-generated + custom option)
- ❌ Step 2: Select format (Email Sequence vs. Bundle)
- ❌ Step 3: Select attachment type (for Bundles only)
- ❌ Step 4: Generation process with progress indicator
- ❌ Step 5: Delivery to editor view
- ❌ Email Sequence output (3 sequential emails)
- ❌ Content Bundle output (Email + Document)
- ❌ Document types:
  - Case Study
  - White Paper
  - ROI Calculator
- ❌ Post-generation actions (edit, save, download, copy, regenerate)
- ❌ Custom angle creation and storage

**Status:** Not started

---

### Component 5: AI Chat for Deal Context ❌ **NOT IMPLEMENTED**

**Note:** Marked as "Future Enhancement" in specification

**Missing Features:**
- ❌ Chat interface for adding conversational context
- ❌ Context storage per deal
- ❌ Integration with meeting prep and content generation
- ❌ Chat history viewing and editing

**Status:** Not started (future feature)

---

## Infrastructure & Foundation ❌ **NOT IMPLEMENTED**

**Missing Core Elements:**
- ❌ Project setup (package.json, dependencies)
- ❌ Frontend framework (React, Next.js, etc.)
- ❌ Backend API structure
- ❌ Database schema and models:
  - Deals
  - Stakeholders
  - Documents
  - Generated Content
  - Custom Angles
- ❌ Authentication & authorization
- ❌ HubSpot API integration
- ❌ LinkedIn scraping integration
- ❌ AI/LLM integration (OpenAI, Anthropic, etc.)
- ❌ Document processing (PDF, DOCX, audio/video transcription)
- ❌ File storage system
- ❌ State management
- ❌ Routing
- ❌ UI component library
- ❌ Styling system
- ❌ Testing framework
- ❌ Build and deployment configuration

---

## Recommended Implementation Order

### Phase 1: Foundation (Week 1-2)
1. Set up project structure (Next.js + TypeScript recommended)
2. Database schema design and setup (PostgreSQL + Prisma recommended)
3. Authentication system
4. Basic routing structure
5. UI component library setup (shadcn/ui recommended)

### Phase 2: Component 1 - Deals List (Week 2-3)
1. Deals data model
2. Deals list view with table
3. Create deal modal
4. Search, filter, sort functionality
5. Basic CRUD operations

### Phase 3: Component 2 - Deal Details Foundation (Week 3-4)
1. Deal detail page structure
2. Deal header with editable fields
3. Tab navigation
4. Stakeholder Map (Tab 2) - full CRUD
5. Deal Context (Tab 3) - document upload

### Phase 4: Component 2 - Overview Tab (Week 4-5)
1. Card 1: Next Actions
2. Card 2: Who to Engage
3. Card 3: What to Ask (static/basic AI)
4. Card 4: What Info to Give (static/basic AI)
5. Card 5: What Data to Add

### Phase 5: Component 3 - Meeting Prep (Week 5-6)
1. AI integration setup
2. Stakeholder selection flow
3. Meeting prep generation
4. Editor view for meeting prep
5. Save/download/copy/regenerate actions

### Phase 6: Component 4 - Content Generation (Week 6-8)
1. Angle selection UI
2. Format selection flow
3. Email sequence generation
4. Bundle generation (email + document)
5. PDF generation for case studies/white papers/ROI calculators
6. Editor view for all content types

### Phase 7: HubSpot Integration (Week 8-9)
1. HubSpot OAuth setup
2. Import deals from HubSpot
3. Sync HubSpot documents
4. Auto-sync background job
5. Refresh functionality

### Phase 8: AI Enhancement & Polish (Week 9-10)
1. Advanced AI prompt engineering
2. Context-aware suggestions
3. LinkedIn profile scraping
4. Document AI processing
5. Performance optimization
6. Bug fixes and polish

---

## Technology Stack Recommendations

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (component library)
- React Hook Form (forms)
- Zustand or Redux Toolkit (state management)

**Backend:**
- Next.js API Routes
- Prisma (ORM)
- PostgreSQL (database)
- tRPC (type-safe API) - optional but recommended

**AI/ML:**
- OpenAI API (GPT-4) or Anthropic Claude
- LangChain (orchestration) - optional

**Integrations:**
- HubSpot API SDK
- LinkedIn scraping (Puppeteer or API if available)

**Document Processing:**
- pdf-lib (PDF generation)
- Mammoth.js (DOCX handling)
- Whisper API (audio transcription)

**File Storage:**
- AWS S3 or Vercel Blob Storage

**Deployment:**
- Vercel (recommended for Next.js)

---

## Estimated Implementation Timeline

**Total Estimated Time:** 10-12 weeks (2.5-3 months) for 1 full-time developer

**Breakdown:**
- Foundation: 2 weeks
- Component 1: 1 week
- Component 2: 2 weeks
- Component 3: 1 week
- Component 4: 2 weeks
- HubSpot Integration: 1 week
- AI Enhancement & Polish: 1 week
- Buffer for testing/fixes: 1-2 weeks

---

## Next Steps

1. **Immediate:** Set up project foundation (package.json, Next.js, TypeScript, Tailwind)
2. **Day 1:** Database schema design
3. **Day 2:** Basic routing and layout structure
4. **Day 3:** Start Component 1 (Deals List)

---

## Notes

- This is a comprehensive SaaS application requiring significant development effort
- The specification is detailed and well-structured
- AI integration is a core feature requiring API costs and careful prompt engineering
- HubSpot integration requires OAuth setup and API credentials
- LinkedIn scraping may have legal/ToS considerations

---

**Document Version:** 1.0
**Last Updated:** November 15, 2025
