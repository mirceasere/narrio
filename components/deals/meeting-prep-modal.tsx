'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { DealWithRelations } from '@/lib/types'
import { BuyerType } from '@prisma/client'
import { Loader2 } from 'lucide-react'

const buyerTypeLabels: Record<BuyerType, string> = {
  ECONOMIC_BUYER: 'Economic Buyer',
  TECHNICAL_BUYER: 'Technical Buyer',
  USER_BUYER: 'User Buyer',
  CHAMPION: 'Champion',
  BLOCKER: 'Blocker',
}

interface MeetingPrepModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deal: DealWithRelations
  onSuccess?: () => void
}

export function MeetingPrepModal({
  open,
  onOpenChange,
  deal,
  onSuccess,
}: MeetingPrepModalProps) {
  const router = useRouter()
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const toggleStakeholder = (id: string) => {
    setSelectedStakeholders((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  const handleGenerate = async () => {
    if (selectedStakeholders.length === 0) {
      alert('Please select at least one stakeholder')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch(`/api/deals/${deal.id}/generate-meeting-prep`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stakeholderIds: selectedStakeholders }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate meeting prep')
      }

      const generatedContent = await response.json()

      onOpenChange(false)
      setSelectedStakeholders([])

      if (onSuccess) {
        onSuccess()
      }

      // Navigate to editor
      router.push(`/deals/${deal.id}/content/${generatedContent.id}`)
    } catch (error) {
      console.error('Error generating meeting prep:', error)
      alert('Failed to generate meeting prep. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Who will attend this meeting?</DialogTitle>
          <DialogDescription>
            Select the stakeholders who will be in this meeting
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {deal.stakeholders.length === 0 ? (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-sm text-muted-foreground">
                No stakeholders added yet. Add stakeholders in the Stakeholder Map
                tab first.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  id="select-all"
                  checked={selectedStakeholders.length === deal.stakeholders.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedStakeholders(deal.stakeholders.map((s) => s.id))
                    } else {
                      setSelectedStakeholders([])
                    }
                  }}
                />
                <Label htmlFor="select-all" className="cursor-pointer font-medium">
                  Select All
                </Label>
              </div>

              {deal.stakeholders.map((stakeholder) => (
                <div
                  key={stakeholder.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={stakeholder.id}
                    checked={selectedStakeholders.includes(stakeholder.id)}
                    onCheckedChange={() => toggleStakeholder(stakeholder.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={stakeholder.id}
                      className="cursor-pointer font-medium"
                    >
                      {stakeholder.fullName}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {stakeholder.companyRole}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {stakeholder.buyerTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {buyerTypeLabels[type]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedStakeholders([])
              onOpenChange(false)
            }}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || selectedStakeholders.length === 0}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Prep'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
