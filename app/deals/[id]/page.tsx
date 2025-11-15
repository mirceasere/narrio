'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DealWithRelations, DealStage } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { OverviewTab } from '@/components/deals/detail/overview-tab'
import { StakeholderMapTab } from '@/components/deals/detail/stakeholder-map-tab'
import { DealContextTab } from '@/components/deals/detail/deal-context-tab'
import { GeneratedContentTab } from '@/components/deals/detail/generated-content-tab'

const stageLabels: Record<DealStage, string> = {
  PROSPECTING: 'Prospecting',
  QUALIFIED: 'Qualified',
  DISCOVERY: 'Discovery',
  PROPOSAL: 'Proposal',
  CLOSED: 'Closed',
}

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [deal, setDeal] = useState<DealWithRelations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [dealName, setDealName] = useState('')

  const fetchDeal = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/deals/${params.id}`)
      const data = await response.json()
      setDeal(data)
      setDealName(data.name)
    } catch (error) {
      console.error('Error fetching deal:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDeal()
  }, [params.id])

  const handleStageChange = async (newStage: DealStage) => {
    if (!deal) return

    try {
      const response = await fetch(`/api/deals/${deal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      })

      if (response.ok) {
        setDeal({ ...deal, stage: newStage })
      }
    } catch (error) {
      console.error('Error updating stage:', error)
    }
  }

  const handleDealValueChange = async (value: string) => {
    if (!deal) return

    const dealValue = value ? parseFloat(value) : null

    try {
      const response = await fetch(`/api/deals/${deal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealValue }),
      })

      if (response.ok) {
        setDeal({ ...deal, dealValue })
      }
    } catch (error) {
      console.error('Error updating deal value:', error)
    }
  }

  const handleNameSave = async () => {
    if (!deal || dealName === deal.name) {
      setEditingName(false)
      return
    }

    try {
      const response = await fetch(`/api/deals/${deal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: dealName }),
      })

      if (response.ok) {
        setDeal({ ...deal, name: dealName })
        setEditingName(false)
      }
    } catch (error) {
      console.error('Error updating deal name:', error)
    }
  }

  const handleHubSpotSync = async () => {
    if (!deal?.isHubSpotImported) return

    setIsSyncing(true)
    try {
      // TODO: Implement HubSpot sync API
      await new Promise(resolve => setTimeout(resolve, 1500))
      await fetchDeal()
    } catch (error) {
      console.error('Error syncing with HubSpot:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Deal not found</h2>
          <Button onClick={() => router.push('/deals')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deals
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <button
          onClick={() => router.push('/deals')}
          className="hover:text-foreground transition-colors"
        >
          Deals
        </button>
        <span>/</span>
        <span className="text-foreground">{deal.companyName}</span>
      </div>

      {/* Deal Header */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {editingName ? (
              <div className="flex items-center gap-2 mb-2">
                <Input
                  value={dealName}
                  onChange={(e) => setDealName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSave()
                    if (e.key === 'Escape') {
                      setDealName(deal.name)
                      setEditingName(false)
                    }
                  }}
                  autoFocus
                  className="text-3xl font-bold h-auto py-2"
                />
              </div>
            ) : (
              <h1
                className="text-3xl font-bold mb-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => setEditingName(true)}
              >
                {deal.name}
              </h1>
            )}
            <p className="text-lg text-muted-foreground">{deal.companyName}</p>
          </div>

          {deal.isHubSpotImported && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleHubSpotSync}
              disabled={isSyncing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`}
              />
              {isSyncing ? 'Syncing...' : 'Sync from HubSpot'}
            </Button>
          )}
        </div>

        {deal.isHubSpotImported && deal.lastHubSpotSync && (
          <p className="text-xs text-muted-foreground mt-2">
            Last synced: {formatDate(deal.lastHubSpotSync)}
          </p>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Stage
            </label>
            <Select value={deal.stage} onValueChange={handleStageChange}>
              <SelectTrigger className="mt-1">
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
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Deal Value
            </label>
            <Input
              type="number"
              placeholder="$0"
              className="mt-1"
              defaultValue={deal.dealValue || ''}
              onBlur={(e) => handleDealValueChange(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Last Contact
            </label>
            <div className="mt-1 flex items-center h-10 px-3 py-2 rounded-md border border-input bg-muted text-sm">
              {deal.lastContactDate
                ? formatDate(deal.lastContactDate)
                : formatDate(deal.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholder Map</TabsTrigger>
          <TabsTrigger value="context">Deal Context</TabsTrigger>
          <TabsTrigger value="generated">Generated Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab deal={deal} onUpdate={fetchDeal} />
        </TabsContent>

        <TabsContent value="stakeholders">
          <StakeholderMapTab deal={deal} onUpdate={fetchDeal} />
        </TabsContent>

        <TabsContent value="context">
          <DealContextTab deal={deal} onUpdate={fetchDeal} />
        </TabsContent>

        <TabsContent value="generated">
          <GeneratedContentTab deal={deal} onUpdate={fetchDeal} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
