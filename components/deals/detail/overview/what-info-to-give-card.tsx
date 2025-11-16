'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DealWithRelations } from '@/lib/types'
import { ContentGenerationModal } from '@/components/deals/content-generation-modal'

interface WhatInfoToGiveCardProps {
  deal: DealWithRelations
  onUpdate: () => void
}

// Mock AI-generated talking points based on deal stage
const getTalkingPointsByStage = (stage: string) => {
  const pointsMap: Record<string, { category: string; point: string }[]> = {
    PROSPECTING: [
      {
        category: 'Time to Value',
        point: 'New reps become productive 60% faster with our platform',
      },
      {
        category: 'ROI',
        point: 'Average customers see 6-month payback period',
      },
      {
        category: 'Social Proof',
        point: 'Used by 500+ B2B sales teams, including Fortune 500 companies',
      },
    ],
    QUALIFIED: [
      {
        category: 'Price Concerns',
        point: 'ROI calculator showing 6-month payback based on your team size',
      },
      {
        category: 'Security',
        point: 'SOC 2 Type II certified with enterprise-grade data encryption',
      },
      {
        category: 'Case Study',
        point: 'SalesTech Co reduced ramp time by 60% in first quarter',
      },
    ],
    DISCOVERY: [
      {
        category: 'Integration',
        point: 'Native HubSpot integration - setup in under 30 minutes',
      },
      {
        category: 'Technical Fit',
        point: 'API documentation and sandbox environment for testing',
      },
      {
        category: 'Support',
        point: 'Dedicated CSM and 24/7 technical support included',
      },
    ],
    PROPOSAL: [
      {
        category: 'Implementation',
        point: 'Full onboarding completed in 2 weeks with white-glove service',
      },
      {
        category: 'Customization',
        point: 'Flexible workflows that adapt to your sales process',
      },
      {
        category: 'Training',
        point: 'Comprehensive training program with ongoing enablement resources',
      },
    ],
    CLOSED: [
      {
        category: 'Next Steps',
        point: 'Implementation timeline and milestone planning',
      },
      {
        category: 'Success Metrics',
        point: 'Quarterly business reviews to track ROI and adoption',
      },
    ],
  }

  return pointsMap[stage] || pointsMap.PROSPECTING
}

export function WhatInfoToGiveCard({ deal, onUpdate }: WhatInfoToGiveCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const talkingPoints = getTalkingPointsByStage(deal.stage)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>What Info to Give</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {talkingPoints.map((point, index) => (
              <li key={index} className="text-sm">
                <span className="font-semibold">{point.category}:</span>{' '}
                {point.point}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setIsModalOpen(true)}>
            Generate Content
          </Button>
        </CardFooter>
      </Card>

      <ContentGenerationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        deal={deal}
        onSuccess={onUpdate}
      />
    </>
  )
}
