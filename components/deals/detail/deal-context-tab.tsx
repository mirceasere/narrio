'use client'

import { DealWithRelations } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

interface DealContextTabProps {
  deal: DealWithRelations
  onUpdate: () => void
}

export function DealContextTab({ deal, onUpdate }: DealContextTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Deal Context</CardTitle>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">
            Document management functionality will be implemented here
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
