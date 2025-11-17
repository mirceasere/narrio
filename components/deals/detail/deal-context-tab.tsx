'use client'

import { useState } from 'react'
import { Download, Eye, FileText, Mail, Phone, Trash2, Upload } from 'lucide-react'
import { DealWithRelations } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { DocumentUploadModal } from '@/components/deals/document-upload-modal'
import { DocumentType, DocumentSource, Document } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const documentTypeLabels: Record<DocumentType, string> = {
  EMAIL: 'Email',
  CALL: 'Call',
  NOTE: 'Note',
  TRANSCRIPT: 'Transcript',
  OTHER: 'Other',
}

const documentTypeIcons: Record<DocumentType, any> = {
  EMAIL: Mail,
  CALL: Phone,
  NOTE: FileText,
  TRANSCRIPT: FileText,
  OTHER: FileText,
}

const sourceLabels: Record<DocumentSource, string> = {
  HUBSPOT: 'HubSpot',
  MANUAL: 'Manual',
}

interface DealContextTabProps {
  deal: DealWithRelations
  onUpdate: () => void
}

export function DealContextTab({ deal, onUpdate }: DealContextTabProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [documentToView, setDocumentToView] = useState<Document | null>(null)

  const handleDelete = async () => {
    if (!documentToDelete) return

    if (documentToDelete.source === 'HUBSPOT') {
      toast.error('Cannot delete HubSpot-synced documents')
      setDeleteDialogOpen(false)
      setDocumentToDelete(null)
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(
        `/api/deals/${deal.id}/documents/${documentToDelete.id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      toast.success('Document deleted successfully')
      setDeleteDialogOpen(false)
      setDocumentToDelete(null)
      onUpdate()
    } catch (error) {
      console.error('Error deleting document:', error)
      toast.error('Failed to delete document. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleView = (document: Document) => {
    setDocumentToView(document)
    setViewDialogOpen(true)
  }

  const getIcon = (type: DocumentType) => {
    const Icon = documentTypeIcons[type]
    return <Icon className="h-4 w-4" />
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Deal Context</CardTitle>
            <Button size="sm" onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {deal.documents.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No documents added yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload emails, call notes, transcripts, and other documents to improve
                AI suggestions
              </p>
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Document
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deal.documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getIcon(document.type)}
                        {document.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {documentTypeLabels[document.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          document.source === 'HUBSPOT' ? 'default' : 'secondary'
                        }
                      >
                        {sourceLabels[document.source]}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(document.uploadedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {document.content && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(document)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View document</TooltipContent>
                          </Tooltip>
                        )}
                        {document.fileUrl && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(document.fileUrl!, '_blank')}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Download document</TooltipContent>
                          </Tooltip>
                        )}
                        {document.source === 'MANUAL' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setDocumentToDelete(document)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete document</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DocumentUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        dealId={deal.id}
        onSuccess={() => {
          setIsUploadModalOpen(false)
          onUpdate()
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "<strong>{documentToDelete?.name}</strong>"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false)
                setDocumentToDelete(null)
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

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{documentToView?.name}</DialogTitle>
            <DialogDescription>
              {documentToView && documentTypeLabels[documentToView.type]} •{' '}
              {documentToView && formatDate(documentToView.uploadedAt)}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px]">
            <div className="whitespace-pre-wrap text-sm p-4 bg-muted rounded-lg">
              {documentToView?.content || 'No content available'}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
