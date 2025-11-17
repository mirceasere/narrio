'use client'

import { useState } from 'react'
import { Edit, ExternalLink, Plus, Trash2 } from 'lucide-react'
import { DealWithRelations } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StakeholderModal } from '@/components/deals/stakeholder-modal'
import { BuyerType, Stakeholder } from '@prisma/client'
import { toast } from 'sonner'

const buyerTypeLabels: Record<BuyerType, string> = {
  ECONOMIC_BUYER: 'Economic Buyer',
  TECHNICAL_BUYER: 'Technical Buyer',
  USER_BUYER: 'User Buyer',
  CHAMPION: 'Champion',
  BLOCKER: 'Blocker',
}

const buyerTypeColors: Record<BuyerType, string> = {
  ECONOMIC_BUYER: 'bg-purple-100 text-purple-800',
  TECHNICAL_BUYER: 'bg-blue-100 text-blue-800',
  USER_BUYER: 'bg-green-100 text-green-800',
  CHAMPION: 'bg-yellow-100 text-yellow-800',
  BLOCKER: 'bg-red-100 text-red-800',
}

interface StakeholderMapTabProps {
  deal: DealWithRelations
  onUpdate: () => void
}

export function StakeholderMapTab({ deal, onUpdate }: StakeholderMapTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(
    null
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [stakeholderToDelete, setStakeholderToDelete] = useState<Stakeholder | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder)
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (!stakeholderToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(
        `/api/deals/${deal.id}/stakeholders/${stakeholderToDelete.id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete stakeholder')
      }

      toast.success('Stakeholder deleted successfully')
      setDeleteDialogOpen(false)
      setStakeholderToDelete(null)
      onUpdate()
    } catch (error) {
      console.error('Error deleting stakeholder:', error)
      toast.error('Failed to delete stakeholder. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingStakeholder(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Stakeholder Map</CardTitle>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stakeholder
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {deal.stakeholders.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">No stakeholders added yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your stakeholder map by adding key contacts
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Stakeholder
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Company Role</TableHead>
                  <TableHead>Buyer Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>LinkedIn</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deal.stakeholders.map((stakeholder) => (
                  <TableRow key={stakeholder.id}>
                    <TableCell className="font-medium">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center gap-3 cursor-pointer">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>{getInitials(stakeholder.fullName)}</AvatarFallback>
                            </Avatar>
                            <span>{stakeholder.fullName}</span>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="text-lg">
                                  {getInitials(stakeholder.fullName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold">{stakeholder.fullName}</h4>
                                <p className="text-sm text-muted-foreground">{stakeholder.companyRole}</p>
                              </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="font-medium">Email:</span>{' '}
                                <a href={`mailto:${stakeholder.email}`} className="text-primary hover:underline">
                                  {stakeholder.email}
                                </a>
                              </p>
                              {stakeholder.linkedinUrl && (
                                <p className="text-sm">
                                  <span className="font-medium">LinkedIn:</span>{' '}
                                  <a
                                    href={stakeholder.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline inline-flex items-center gap-1"
                                  >
                                    View Profile
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </p>
                              )}
                              {stakeholder.buyerTypes.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium mb-1">Buyer Types:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {stakeholder.buyerTypes.map((type) => (
                                      <Badge
                                        key={type}
                                        variant="outline"
                                        className={buyerTypeColors[type]}
                                      >
                                        {buyerTypeLabels[type]}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell>{stakeholder.companyRole}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {stakeholder.buyerTypes.map((type) => (
                          <Badge
                            key={type}
                            variant="outline"
                            className={buyerTypeColors[type]}
                          >
                            {buyerTypeLabels[type]}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${stakeholder.email}`}
                        className="text-primary hover:underline"
                      >
                        {stakeholder.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      {stakeholder.linkedinUrl ? (
                        <a
                          href={stakeholder.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Profile
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(stakeholder)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit stakeholder</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setStakeholderToDelete(stakeholder)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete stakeholder</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <StakeholderModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        dealId={deal.id}
        stakeholder={editingStakeholder}
        onSuccess={() => {
          handleModalClose()
          onUpdate()
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stakeholder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{stakeholderToDelete?.fullName}</strong>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false)
                setStakeholderToDelete(null)
              }}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
