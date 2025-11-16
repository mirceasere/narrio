import { DealWithRelations } from './types'
import { DealStage } from '@prisma/client'

// Mock AI Service - In production, this would call OpenAI/Anthropic API

export interface MeetingPrepData {
  stakeholderNames: string[]
  content: string
}

export interface EmailSequenceData {
  emails: {
    number: number
    subject: string
    body: string
    suggestedTiming: string
  }[]
}

export interface BundleData {
  email: {
    subject: string
    body: string
  }
  document: {
    type: 'case_study' | 'white_paper' | 'roi_calculator'
    content: string
  }
}

export async function generateMeetingPrep(
  deal: DealWithRelations,
  stakeholderIds: string[]
): Promise<MeetingPrepData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const stakeholders = deal.stakeholders.filter((s) =>
    stakeholderIds.includes(s.id)
  )
  const stakeholderNames = stakeholders.map((s) => s.fullName)
  const roles = stakeholders.map((s) => `${s.fullName}, ${s.companyRole}`).join('; ')

  const content = `Meeting Prep: ${stakeholderNames.join(', ')}

Context
- Who: ${roles}
- Company: ${deal.companyName}
- Deal Stage: ${deal.stage}
- Deal Value: ${deal.dealValue ? `$${deal.dealValue.toLocaleString()}` : 'TBD'}

${deal.companyName}'s Sales Reality
Current Process:
- ${deal.companyName} is currently in the ${deal.stage.toLowerCase()} phase
- Looking to improve their sales enablement and rep productivity
- Key stakeholders identified: ${stakeholderNames.join(', ')}

Pain Points:
- New sales reps taking too long to become productive
- Inconsistent messaging across the sales team
- Difficulty tracking deal progress and next actions
- Limited visibility into stakeholder engagement

Narrio Value Props for ${deal.companyName}
1. Accelerated Rep Ramp Time
   - Get new reps productive 60% faster with AI-powered enablement
   - Personalized learning paths based on deal complexity and stakeholder types

2. Intelligent Deal Management
   - AI-suggested next actions keep deals moving forward
   - Automatic stakeholder mapping and engagement tracking
   - Smart content generation for every deal stage

3. Comprehensive Deal Context
   - All call notes, emails, and documents in one place
   - AI analysis of deal sentiment and risk factors
   - Automated meeting prep and follow-up content

Meeting Approach
Opening Hook: Reference their specific challenges around ${deal.stage === 'PROSPECTING' ? 'initial outreach and qualification' : deal.stage === 'DISCOVERY' ? 'deep discovery and technical validation' : 'proposal development and closing'}

Demo Focus:
- Show: How Narrio tracks stakeholder engagement and suggests optimal next actions
- Use: ${deal.companyName}'s current deal stage as a live example
- Demonstrate: AI-generated meeting prep and content that saves 5+ hours per week

Pilot Structure:
- Start with ${stakeholders.length === 1 ? 'one key deal' : `${stakeholders.length} active deals`}
- Measure: Time to productivity, deal velocity, and win rate
- Duration: 30-day pilot with weekly check-ins

Key Points to Emphasize:
- ROI: Average customers see 6-month payback period
- Security: SOC 2 Type II certified with enterprise-grade encryption
- Integration: Native HubSpot and Salesforce integrations
- Support: Dedicated CSM and 24/7 technical support

Questions to Ask:
1. What's your current process for onboarding new sales reps?
2. How do you currently track deal progress and stakeholder engagement?
3. What would success look like for you in the next 90 days?
4. Who else needs to be involved in this evaluation?
5. What's your timeline for implementing a solution?

Next Steps:
- Schedule technical deep-dive with ${stakeholders.find(s => s.buyerTypes.includes('TECHNICAL_BUYER'))?.fullName || 'technical team'}
- Provide ROI calculator customized to ${deal.companyName}'s team size
- Send case study from similar ${deal.companyName.includes('Tech') || deal.companyName.includes('Software') ? 'technology' : 'B2B'} company
`

  return {
    stakeholderNames,
    content,
  }
}

export async function generateEmailSequence(
  deal: DealWithRelations,
  angle: string
): Promise<EmailSequenceData> {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const emails = [
    {
      number: 1,
      subject: `${angle} - Quick question for ${deal.companyName}`,
      body: `Hi ${deal.clientFullName},

I wanted to reach out because I noticed ${deal.companyName} is in growth mode, and I thought you might be interested in how we're helping companies like yours ${angle.toLowerCase()}.

We recently worked with a similar company that saw:
• 60% faster ramp time for new sales reps
• 25% increase in deal velocity
• 5+ hours saved per rep per week

Would you be open to a 15-minute call to discuss how this might apply to ${deal.companyName}?

Best regards`,
      suggestedTiming: 'Send immediately',
    },
    {
      number: 2,
      subject: `Re: ${angle} - Sharing a quick resource`,
      body: `Hi ${deal.clientFullName},

Following up on my previous email - I wanted to share a case study that might be relevant to ${deal.companyName}.

[Company Name] had similar challenges around ${angle.toLowerCase()} and saw measurable results in just 30 days:
• Quantifiable ROI metrics
• Reduced time-to-productivity
• Improved win rates

I'd love to show you how we can deliver similar results for ${deal.companyName}.

Are you available for a brief call this week?

Best regards`,
      suggestedTiming: 'Send 3 days after Email 1',
    },
    {
      number: 3,
      subject: `Last follow-up - ${angle} opportunity`,
      body: `Hi ${deal.clientFullName},

I know you're busy, so I'll keep this brief.

I wanted to make sure you saw the information about ${angle.toLowerCase()}. Given ${deal.companyName}'s growth trajectory, I think there's a real opportunity here.

If now isn't the right time, no problem - just let me know and I'll follow up in a few months.

Otherwise, I'd love to schedule a quick 15-minute call to show you what's possible.

Best regards`,
      suggestedTiming: 'Send 5 days after Email 2',
    },
  ]

  return { emails }
}

export async function generateBundle(
  deal: DealWithRelations,
  angle: string,
  attachmentType: 'case_study' | 'white_paper' | 'roi_calculator'
): Promise<BundleData> {
  await new Promise((resolve) => setTimeout(resolve, 2500))

  const email = {
    subject: `${attachmentType === 'case_study' ? 'Success Story' : attachmentType === 'white_paper' ? 'Resource' : 'ROI Analysis'} - ${angle}`,
    body: `Hi ${deal.clientFullName},

Based on our recent conversation about ${angle.toLowerCase()}, I wanted to share a ${attachmentType.replace('_', ' ')} that I think you'll find valuable.

${attachmentType === 'case_study' ?
  `This case study shows how a company similar to ${deal.companyName} achieved:
• 60% reduction in rep ramp time
• 25% increase in deal velocity
• Measurable ROI in just 6 months` :
  attachmentType === 'white_paper' ?
  `This white paper outlines best practices for ${angle.toLowerCase()} and includes:
• Industry benchmarks and trends
• Implementation framework
• Success metrics to track` :
  `This ROI calculator is customized for ${deal.companyName} and shows:
• Expected cost savings in Year 1
• Revenue impact from improved productivity
• 3-year projected ROI`}

I'd love to discuss how we can deliver similar results for ${deal.companyName}.

When would be a good time for a brief call?

Best regards`,
  }

  let documentContent = ''

  if (attachmentType === 'case_study') {
    documentContent = `CASE STUDY: ${deal.companyName} Success Story

Company Profile
Industry: B2B SaaS
Company Size: 50-200 employees
Challenge: Long sales rep ramp time and inconsistent deal management

The Challenge
Before implementing Narrio, this company faced:
- New reps taking 6+ months to reach full productivity
- Inconsistent messaging across the sales team
- Lost deals due to poor stakeholder management
- Time-consuming manual prep and follow-up

The Solution
Implemented Narrio's SDR Deal Management platform with:
- AI-powered meeting prep and content generation
- Automated stakeholder tracking
- Intelligent next action suggestions
- Comprehensive deal context management

Results
After 90 days:
- 60% reduction in rep ramp time (from 6 months to 2.5 months)
- 25% increase in deal velocity
- 40% improvement in stakeholder engagement
- 5+ hours saved per rep per week

ROI Impact
Year 1 ROI: 280%
Payback period: 6 months
Cost savings: $150K annually
Revenue impact: $500K+ from improved win rates

"Narrio transformed how our team manages deals. The AI suggestions are spot-on, and our reps are more productive than ever." - VP of Sales

Next Steps
See how ${deal.companyName} can achieve similar results.`
  } else if (attachmentType === 'white_paper') {
    documentContent = `WHITE PAPER: ${angle}

Executive Summary
In today's fast-paced B2B sales environment, ${angle.toLowerCase()} has become a critical success factor. This white paper explores best practices and proven strategies.

The Current State
Research shows that:
- 67% of sales reps struggle with stakeholder management
- Average rep ramp time is 6+ months
- 40% of deals are lost due to poor engagement
- SDRs spend 60% of time on administrative tasks

Key Challenges
1. Information Overload
   - Too many tools and disconnected data
   - Difficulty finding relevant context

2. Inefficient Processes
   - Manual meeting prep and follow-up
   - Repetitive content creation

3. Limited Visibility
   - Poor stakeholder tracking
   - No insight into deal health

Best Practices for ${angle}
1. Centralize Deal Context
   - All documents and communications in one place
   - AI-powered analysis and insights

2. Automate Repetitive Tasks
   - Meeting prep generation
   - Follow-up content creation
   - Next action suggestions

3. Track Stakeholder Engagement
   - Identify key decision makers
   - Monitor engagement levels
   - Spot gaps early

Implementation Framework
Phase 1 (Week 1-2): Setup and Integration
Phase 2 (Week 3-4): Team Onboarding
Phase 3 (Month 2): Optimization and Scaling

Success Metrics
- Time to productivity
- Deal velocity
- Win rate
- Hours saved per rep

Conclusion
Companies that excel at ${angle.toLowerCase()} see measurable improvements in productivity, win rates, and revenue.

About Narrio
Narrio is the leading AI-powered SDR deal management platform, trusted by 500+ sales teams worldwide.`
  } else {
    documentContent = `ROI CALCULATOR for ${deal.companyName}

Input Assumptions
- Number of SDRs: 10
- Average SDR salary: $60,000
- Average deal size: $${deal.dealValue || 50000}
- Current average ramp time: 6 months
- Current win rate: 25%

Current State Analysis
Annual SDR cost: $600,000
Lost productivity (first 6 months): $300,000
Total annual cost: $900,000

With Narrio
Reduced ramp time: 2.5 months (60% reduction)
Improved win rate: 31% (25% increase)
Time saved per rep: 5 hours/week

Financial Impact

Cost Savings
Reduced ramp time cost: $180,000
Improved efficiency: $120,000
Total savings: $300,000

Revenue Impact
Additional deals won: 15/year
Revenue from improved win rate: $${((deal.dealValue || 50000) * 15).toLocaleString()}
Total revenue impact: $${((deal.dealValue || 50000) * 15).toLocaleString()}

ROI Summary
Year 1 Investment: $${(10 * 12000).toLocaleString()} (Narrio platform)
Year 1 Return: $${(300000 + ((deal.dealValue || 50000) * 15)).toLocaleString()}
Year 1 ROI: ${Math.round((300000 + ((deal.dealValue || 50000) * 15)) / (10 * 12000) * 100)}%
Payback Period: 6 months

3-Year Projection
Year 1: $${(300000 + ((deal.dealValue || 50000) * 15)).toLocaleString()}
Year 2: $${((300000 + ((deal.dealValue || 50000) * 15)) * 1.2).toLocaleString()}
Year 3: $${((300000 + ((deal.dealValue || 50000) * 15)) * 1.4).toLocaleString()}

Total 3-Year Value: $${((300000 + ((deal.dealValue || 50000) * 15)) * 3.6).toLocaleString()}

Next Steps
1. Schedule demo to see Narrio in action
2. Run pilot with 3-5 reps
3. Measure results after 30 days
4. Scale to full team

Contact us to customize this analysis for ${deal.companyName}'s specific situation.`
  }

  return {
    email,
    document: {
      type: attachmentType,
      content: documentContent,
    },
  }
}

export async function generateAngles(deal: DealWithRelations): Promise<{title: string; description: string}[]> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const angles = [
    {
      title: 'ROI-Focused Budget Justification',
      description: `Address ${deal.companyName}'s budget concerns with quantified ROI, payback period, and cost-benefit analysis specific to their team size and current vendor spend.`,
    },
    {
      title: 'Competitive Differentiation',
      description: `Highlight key advantages over their current solution, focusing on faster implementation, better stakeholder management, and superior AI capabilities.`,
    },
    {
      title: 'Speed to Value',
      description: `Emphasize quick implementation (under 2 weeks) and immediate productivity gains, showing how ${deal.companyName} can see results in the first 30 days.`,
    },
  ]

  return angles
}
