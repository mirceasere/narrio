'use client'

import { DealWithRelations } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface GeneratedContentTabProps {
  deal: DealWithRelations
  onUpdate: () => void
}

export function GeneratedContentTab({ deal, onUpdate }: GeneratedContentTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Generated Content</CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Generate Content
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">
            Content generation functionality will be implemented here
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
