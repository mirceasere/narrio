'use client'

import { DealWithRelations } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface StakeholderMapTabProps {
  deal: DealWithRelations
  onUpdate: () => void
}

export function StakeholderMapTab({ deal, onUpdate }: StakeholderMapTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Stakeholder Map</CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Stakeholder
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">
            Stakeholder management functionality will be implemented here
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
