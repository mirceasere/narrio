'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DealWithRelations } from '@/lib/types'
import { BuyerType } from '@prisma/client'

const buyerTypeLabels: Record<BuyerType, string> = {
  ECONOMIC_BUYER: 'Economic Buyer',
  TECHNICAL_BUYER: 'Technical Buyer',
  USER_BUYER: 'User Buyer',
  CHAMPION: 'Champion',
  BLOCKER: 'Blocker',
}

interface WhoToEngageCardProps {
  deal: DealWithRelations
}

export function WhoToEngageCard({ deal }: WhoToEngageCardProps) {
  const buyerTypesOfInterest: BuyerType[] = [
    'CHAMPION',
    'ECONOMIC_BUYER',
    'TECHNICAL_BUYER',
    'USER_BUYER',
  ]

  const getStakeholdersForBuyerType = (buyerType: BuyerType) => {
    return deal.stakeholders.filter((s) =>
      s.buyerTypes.includes(buyerType)
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who to Engage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {buyerTypesOfInterest.map((buyerType) => {
            const stakeholders = getStakeholdersForBuyerType(buyerType)
            const hasStakeholder = stakeholders.length > 0

            return (
              <div
                key={buyerType}
                className="flex items-center gap-3 p-3 rounded-lg border"
              >
                {hasStakeholder ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {buyerTypeLabels[buyerType]}:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {hasStakeholder ? (
                      stakeholders.map((s) => s.fullName).join(', ')
                    ) : (
                      <span className="text-yellow-600">Not identified</span>
                    )}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/deals/${deal.id}?tab=stakeholders`} className="w-full">
          <Button variant="link" className="w-full">
            View full stakeholder map
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
