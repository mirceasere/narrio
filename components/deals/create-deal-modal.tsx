'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DealStage } from '@prisma/client'
import { extractDomainFromEmail, extractCompanyFromDomain } from '@/lib/utils'
import { toast } from 'sonner'

const createDealSchema = z.object({
  name: z.string().min(1, 'Deal name is required'),
  clientFullName: z.string().min(1, 'Client full name is required'),
  clientEmail: z.string().email('Invalid email address'),
  clientWebsite: z.string().url('Invalid URL').or(z.literal('')),
  companyName: z.string().min(1, 'Company name is required'),
  dealValue: z.string().optional(),
  stage: z.enum(['PROSPECTING', 'QUALIFIED', 'DISCOVERY', 'PROPOSAL', 'CLOSED']),
})

type CreateDealForm = z.infer<typeof createDealSchema>

const stageLabels: Record<DealStage, string> = {
  PROSPECTING: 'Prospecting',
  QUALIFIED: 'Qualified',
  DISCOVERY: 'Discovery',
  PROPOSAL: 'Proposal',
  CLOSED: 'Closed',
}

interface CreateDealModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateDealModal({ open, onOpenChange, onSuccess }: CreateDealModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateDealForm>({
    resolver: zodResolver(createDealSchema),
    defaultValues: {
      stage: 'PROSPECTING',
    },
  })

  const clientEmail = watch('clientEmail')
  const clientWebsite = watch('clientWebsite')

  // Auto-fill website from email
  const handleEmailBlur = () => {
    if (clientEmail && !clientWebsite) {
      const domain = extractDomainFromEmail(clientEmail)
      if (domain) {
        setValue('clientWebsite', `https://${domain}`)
      }
    }
  }

  // Auto-fill company name from website
  const handleWebsiteBlur = () => {
    const website = watch('clientWebsite')
    const companyName = watch('companyName')

    if (website && !companyName) {
      try {
        const url = new URL(website)
        const company = extractCompanyFromDomain(url.hostname)
        setValue('companyName', company)
      } catch (e) {
        // Invalid URL, ignore
      }
    }
  }

  const onSubmit = async (data: CreateDealForm) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          dealValue: data.dealValue ? parseFloat(data.dealValue) : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create deal')
      }

      const deal = await response.json()
      toast.success('Deal created successfully!')
      onOpenChange(false)

      if (onSuccess) {
        onSuccess()
      }

      // Navigate to deal detail view
      router.push(`/deals/${deal.id}`)
    } catch (error) {
      console.error('Error creating deal:', error)
      toast.error('Failed to create deal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
          <DialogDescription>
            Create a new deal by filling in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Deal Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Q1 2025 Contract"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="clientFullName">
                Client's Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="clientFullName"
                placeholder="John Smith"
                {...register('clientFullName')}
              />
              {errors.clientFullName && (
                <p className="text-sm text-destructive">{errors.clientFullName.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="clientEmail">
                Client's Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="john@acmecorp.com"
                {...register('clientEmail')}
                onBlur={handleEmailBlur}
              />
              {errors.clientEmail && (
                <p className="text-sm text-destructive">{errors.clientEmail.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="clientWebsite">
                Client's Website <span className="text-destructive">*</span>
              </Label>
              <Input
                id="clientWebsite"
                type="url"
                placeholder="https://acmecorp.com"
                {...register('clientWebsite')}
                onBlur={handleWebsiteBlur}
              />
              {errors.clientWebsite && (
                <p className="text-sm text-destructive">{errors.clientWebsite.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Auto-fills from email domain
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="companyName">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="Acme Corp"
                {...register('companyName')}
              />
              {errors.companyName && (
                <p className="text-sm text-destructive">{errors.companyName.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Auto-fills from website domain
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dealValue">Deal Value ($)</Label>
              <Input
                id="dealValue"
                type="number"
                placeholder="50000"
                {...register('dealValue')}
              />
              {errors.dealValue && (
                <p className="text-sm text-destructive">{errors.dealValue.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stage">
                Stage <span className="text-destructive">*</span>
              </Label>
              <Select
                defaultValue="PROSPECTING"
                onValueChange={(value) => setValue('stage', value as DealStage)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(stageLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.stage && (
                <p className="text-sm text-destructive">{errors.stage.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Deal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
