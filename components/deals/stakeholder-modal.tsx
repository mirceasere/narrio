'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { BuyerType, Stakeholder } from '@prisma/client'
import { toast } from 'sonner'

const buyerTypeLabels: Record<BuyerType, string> = {
  ECONOMIC_BUYER: 'Economic Buyer',
  TECHNICAL_BUYER: 'Technical Buyer',
  USER_BUYER: 'User Buyer',
  CHAMPION: 'Champion',
  BLOCKER: 'Blocker',
}

const stakeholderSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  companyRole: z.string().min(1, 'Company role is required'),
  email: z.string().email('Invalid email address'),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  buyerTypes: z.array(z.enum(['ECONOMIC_BUYER', 'TECHNICAL_BUYER', 'USER_BUYER', 'CHAMPION', 'BLOCKER'])).min(1, 'Select at least one buyer type'),
})

type StakeholderForm = z.infer<typeof stakeholderSchema>

interface StakeholderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dealId: string
  stakeholder?: Stakeholder | null
  onSuccess?: () => void
}

export function StakeholderModal({
  open,
  onOpenChange,
  dealId,
  stakeholder,
  onSuccess,
}: StakeholderModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBuyerTypes, setSelectedBuyerTypes] = useState<BuyerType[]>(
    stakeholder?.buyerTypes || []
  )

  const isEditing = !!stakeholder

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StakeholderForm>({
    resolver: zodResolver(stakeholderSchema),
    defaultValues: stakeholder
      ? {
          fullName: stakeholder.fullName,
          companyRole: stakeholder.companyRole,
          email: stakeholder.email,
          linkedinUrl: stakeholder.linkedinUrl || '',
          buyerTypes: stakeholder.buyerTypes,
        }
      : undefined,
  })

  const toggleBuyerType = (type: BuyerType) => {
    setSelectedBuyerTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const onSubmit = async (data: StakeholderForm) => {
    if (selectedBuyerTypes.length === 0) {
      toast.error('Please select at least one buyer type')
      return
    }

    setIsLoading(true)
    try {
      const url = isEditing
        ? `/api/deals/${dealId}/stakeholders/${stakeholder.id}`
        : `/api/deals/${dealId}/stakeholders`

      const method = isEditing ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          buyerTypes: selectedBuyerTypes,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save stakeholder')
      }

      reset()
      setSelectedBuyerTypes([])
      onOpenChange(false)

      if (onSuccess) {
        onSuccess()
      }
      toast.success(stakeholder ? 'Stakeholder updated successfully' : 'Stakeholder created successfully')
    } catch (error) {
      console.error('Error saving stakeholder:', error)
      toast.error('Failed to save stakeholder. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Stakeholder' : 'Add Stakeholder'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update stakeholder information'
              : 'Add a new stakeholder to this deal'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="Sarah Chen"
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="companyRole">
                Company Role <span className="text-destructive">*</span>
              </Label>
              <Input
                id="companyRole"
                placeholder="CTO"
                {...register('companyRole')}
              />
              {errors.companyRole && (
                <p className="text-sm text-destructive">
                  {errors.companyRole.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="sarah@company.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
              <Input
                id="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/sarahchen"
                {...register('linkedinUrl')}
              />
              {errors.linkedinUrl && (
                <p className="text-sm text-destructive">
                  {errors.linkedinUrl.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>
                Buyer Type <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Select all that apply
              </p>
              <div className="space-y-2">
                {Object.entries(buyerTypeLabels).map(([value, label]) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={value}
                      checked={selectedBuyerTypes.includes(value as BuyerType)}
                      onCheckedChange={() => toggleBuyerType(value as BuyerType)}
                    />
                    <Label
                      htmlFor={value}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedBuyerTypes.length === 0 && (
                <p className="text-sm text-destructive">
                  Select at least one buyer type
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setSelectedBuyerTypes(stakeholder?.buyerTypes || [])
                onOpenChange(false)
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : isEditing
                ? 'Save Changes'
                : 'Add Stakeholder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
