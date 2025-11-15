'use client'

import { DealWithRelations } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NextActionsCard } from './overview/next-actions-card'
import { WhoToEngageCard } from './overview/who-to-engage-card'
import { WhatToAskCard } from './overview/what-to-ask-card'
import { WhatInfoToGiveCard } from './overview/what-info-to-give-card'
import { WhatDataToAddCard } from './overview/what-data-to-add-card'

interface OverviewTabProps {
  deal: DealWithRelations
  onUpdate: () => void
}

export function OverviewTab({ deal, onUpdate }: OverviewTabProps) {
  return (
    <div className="grid gap-6">
      <NextActionsCard deal={deal} onUpdate={onUpdate} />
      <WhoToEngageCard deal={deal} />
      <WhatToAskCard deal={deal} />
      <WhatInfoToGiveCard deal={deal} />
      <WhatDataToAddCard deal={deal} />
    </div>
  )
}
