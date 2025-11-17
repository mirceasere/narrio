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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DocumentType } from '@prisma/client'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'

const documentTypeLabels: Record<DocumentType, string> = {
  EMAIL: 'Email',
  CALL: 'Call',
  NOTE: 'Note',
  TRANSCRIPT: 'Transcript',
  OTHER: 'Other',
}

const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  type: z.enum(['EMAIL', 'CALL', 'NOTE', 'TRANSCRIPT', 'OTHER']),
  content: z.string().optional(),
})

type DocumentForm = z.infer<typeof documentSchema>

interface DocumentUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dealId: string
  onSuccess?: () => void
}

export function DocumentUploadModal({
  open,
  onOpenChange,
  dealId,
  onSuccess,
}: DocumentUploadModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<DocumentType>('NOTE')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DocumentForm>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      type: 'NOTE',
    },
  })

  const onSubmit = async (data: DocumentForm) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/deals/${dealId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          type: selectedType,
          source: 'MANUAL',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to upload document')
      }

      reset()
      setSelectedType('NOTE')
      onOpenChange(false)

      if (onSuccess) {
        onSuccess()
      }
      toast.success('Document uploaded successfully')
    } catch (error) {
      console.error('Error uploading document:', error)
      toast.error('Failed to upload document. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a document related to this deal
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Document Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Discovery Call - Jan 15"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">
                Document Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as DocumentType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(documentTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Document Content</Label>
              <Textarea
                id="content"
                placeholder="Paste transcript, email content, or notes here..."
                rows={8}
                {...register('content')}
              />
              <p className="text-xs text-muted-foreground">
                This content will be analyzed by AI to improve suggestions
              </p>
            </div>

            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">
                File Upload (Coming Soon)
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOCX, TXT, or audio files
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setSelectedType('NOTE')
                onOpenChange(false)
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
