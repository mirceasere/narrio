'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Mail, Package, Plus, Search, Trash2 } from 'lucide-react'
import { DealWithRelations } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { ContentGenerationModal } from '@/components/deals/content-generation-modal'
import { MeetingPrepModal } from '@/components/deals/meeting-prep-modal'
import { GeneratedContent, GeneratedContentType } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const contentTypeLabels: Record<GeneratedContentType, string> = {
  MEETING_PREP: 'Meeting Prep',
  EMAIL_SEQUENCE: 'Email Sequence',
  BUNDLE: 'Bundle',
}

const contentTypeIcons: Record<GeneratedContentType, any> = {
  MEETING_PREP: FileText,
  EMAIL_SEQUENCE: Mail,
  BUNDLE: Package,
}

interface GeneratedContentTabProps {
  deal: DealWithRelations
  onUpdate: () => void
}

export function GeneratedContentTab({ deal, onUpdate }: GeneratedContentTabProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [isContentModalOpen, setIsContentModalOpen] = useState(false)
  const [isMeetingPrepModalOpen, setIsMeetingPrepModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contentToDelete, setContentToDelete] = useState<GeneratedContent | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!contentToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(
        `/api/deals/${deal.id}/generated-content/${contentToDelete.id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete content')
      }

      toast.success('Content deleted successfully')
      setDeleteDialogOpen(false)
      setContentToDelete(null)
      onUpdate()
    } catch (error) {
      console.error('Error deleting content:', error)
      toast.error('Failed to delete content. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredContent = deal.generatedContent.filter((content) => {
    const matchesSearch =
      content.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.angle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || content.type === typeFilter

    return matchesSearch && matchesType
  })

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated Content</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setIsMeetingPrepModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Meeting Prep
              </Button>
              <Button size="sm" onClick={() => setIsContentModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {deal.generatedContent.length > 0 && (
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(contentTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filteredContent.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              {deal.generatedContent.length === 0 ? (
                <>
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    No content generated yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Generate meeting prep, email sequences, or content bundles to get
                    started
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setIsMeetingPrepModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Meeting Prep
                    </Button>
                    <Button onClick={() => setIsContentModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Content
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">
                  No content matches your search or filter criteria
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredContent.map((content) => {
                const Icon = contentTypeIcons[content.type]
                return (
                  <div
                    key={content.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() =>
                      router.push(`/deals/${deal.id}/content/${content.id}`)
                    }
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                        <Badge variant="secondary">
                          {contentTypeLabels[content.type]}
                        </Badge>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              setContentToDelete(content)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete content</TooltipContent>
                      </Tooltip>
                    </div>
                    <h4 className="font-semibold mb-1">{content.name}</h4>
                    {content.angle && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {content.angle}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDate(content.createdAt)}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ContentGenerationModal
        open={isContentModalOpen}
        onOpenChange={setIsContentModalOpen}
        deal={deal}
        onSuccess={() => {
          setIsContentModalOpen(false)
          onUpdate()
        }}
      />

      <MeetingPrepModal
        open={isMeetingPrepModalOpen}
        onOpenChange={setIsMeetingPrepModalOpen}
        deal={deal}
        onSuccess={() => {
          setIsMeetingPrepModalOpen(false)
          onUpdate()
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "<strong>{contentToDelete?.name}</strong>"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false)
                setContentToDelete(null)
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
