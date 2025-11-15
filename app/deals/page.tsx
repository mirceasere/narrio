'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CreateDealModal } from '@/components/deals/create-deal-modal'
import { DealListItem } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DealStage } from '@prisma/client'

const stageLabels: Record<DealStage, string> = {
  PROSPECTING: 'Prospecting',
  QUALIFIED: 'Qualified',
  DISCOVERY: 'Discovery',
  PROPOSAL: 'Proposal',
  CLOSED: 'Closed',
}

const stageColors: Record<DealStage, string> = {
  PROSPECTING: 'bg-gray-100 text-gray-800',
  QUALIFIED: 'bg-blue-100 text-blue-800',
  DISCOVERY: 'bg-yellow-100 text-yellow-800',
  PROPOSAL: 'bg-purple-100 text-purple-800',
  CLOSED: 'bg-green-100 text-green-800',
}

export default function DealsPage() {
  const router = useRouter()
  const [deals, setDeals] = useState<DealListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchDeals = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        sortBy,
        sortOrder,
      })

      if (stageFilter !== 'all') {
        params.append('stage', stageFilter)
      }

      const response = await fetch(`/api/deals?${params}`)
      const data = await response.json()
      setDeals(data)
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDeals()
  }, [searchQuery, stageFilter, sortBy, sortOrder])

  const handleRowClick = (dealId: string) => {
    router.push(`/deals/${dealId}`)
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Deals</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your active deals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchDeals}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deals by company, contact, or deal name..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {Object.entries(stageLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No deals found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || stageFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first deal'}
          </p>
          {!searchQuery && stageFilter === 'all' && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Deal
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('companyName')}
                >
                  Company
                  {sortBy === 'companyName' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('clientFullName')}
                >
                  Contact
                  {sortBy === 'clientFullName' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('stage')}
                >
                  Stage
                  {sortBy === 'stage' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('dealValue')}
                >
                  Value
                  {sortBy === 'dealValue' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('lastContactDate')}
                >
                  Last Activity
                  {sortBy === 'lastContactDate' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead>Next Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow
                  key={deal.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(deal.id)}
                >
                  <TableCell className="font-medium">{deal.companyName}</TableCell>
                  <TableCell>{deal.clientFullName}</TableCell>
                  <TableCell>
                    <Badge className={stageColors[deal.stage]} variant="outline">
                      {stageLabels[deal.stage]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {deal.dealValue ? formatCurrency(deal.dealValue) : '-'}
                  </TableCell>
                  <TableCell>
                    {deal.lastContactDate
                      ? formatDate(deal.lastContactDate)
                      : formatDate(deal.createdAt)}
                  </TableCell>
                  <TableCell>
                    {deal.uncheckedNextActions > 0 ? (
                      <Badge variant="secondary">
                        {deal.uncheckedNextActions} unchecked
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateDealModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchDeals}
      />
    </div>
  )
}
