'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DealWithRelations } from '@/lib/types'
import { BuyerType } from '@prisma/client'

interface WhatDataToAddCardProps {
  deal: DealWithRelations
}

export function WhatDataToAddCard({ deal }: WhatDataToAddCardProps) {
  const prompts: { text: string; link: string; tab: string }[] = []

  // Check for missing discovery call transcript
  const hasCallTranscript = deal.documents.some((d) => d.type === 'CALL')
  if (!hasCallTranscript && deal.stage !== 'PROSPECTING') {
    prompts.push({
      text: 'Upload discovery call transcript to generate better follow-up angles',
      link: `/deals/${deal.id}?tab=context`,
      tab: 'Deal Context',
    })
  }

  // Check for missing stakeholder LinkedIn profiles
  const stakeholdersWithoutLinkedIn = deal.stakeholders.filter(
    (s) => !s.linkedinUrl
  )
  if (stakeholdersWithoutLinkedIn.length > 0) {
    const stakeholderNames = stakeholdersWithoutLinkedIn
      .map((s) => s.fullName)
      .slice(0, 2)
      .join(', ')
    prompts.push({
      text: `Add LinkedIn profile for ${stakeholderNames} to personalize outreach`,
      link: `/deals/${deal.id}?tab=stakeholders`,
      tab: 'Stakeholder Map',
    })
  }

  // Check for missing technical buyer
  const hasTechnicalBuyer = deal.stakeholders.some((s) =>
    s.buyerTypes.includes('TECHNICAL_BUYER' as BuyerType)
  )
  if (!hasTechnicalBuyer && ['DISCOVERY', 'PROPOSAL'].includes(deal.stage)) {
    prompts.push({
      text: 'Identify Technical Buyer to address integration concerns',
      link: `/deals/${deal.id}?tab=stakeholders`,
      tab: 'Stakeholder Map',
    })
  }

  // Check for missing documents
  if (deal.documents.length === 0) {
    prompts.push({
      text: 'Upload meeting notes or emails to improve AI suggestions',
      link: `/deals/${deal.id}?tab=context`,
      tab: 'Deal Context',
    })
  }

  // Check for missing contract/proposal documents
  const hasProposalDoc = deal.documents.some((d) =>
    d.name.toLowerCase().includes('proposal') ||
    d.name.toLowerCase().includes('contract')
  )
  if (!hasProposalDoc && deal.stage === 'PROPOSAL') {
    prompts.push({
      text: 'Upload their current vendor contract to identify competitive advantages',
      link: `/deals/${deal.id}?tab=context`,
      tab: 'Deal Context',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>What Data to Add</CardTitle>
      </CardHeader>
      <CardContent>
        {prompts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Great! You have all the key data needed. Keep adding more context as
            you learn about this deal.
          </p>
        ) : (
          <ul className="space-y-3">
            {prompts.map((prompt, index) => (
              <li key={index}>
                <Link
                  href={prompt.link}
                  className="text-sm text-primary hover:underline flex items-start gap-2"
                >
                  <span className="text-muted-foreground">•</span>
                  <span>{prompt.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
