'use client'

import { useState, useEffect } from 'react'
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
import { DealWithRelations } from '@/lib/types'
import { ChevronLeft, Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface ContentGenerationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deal: DealWithRelations
  onSuccess?: () => void
}

type Step = 'angle' | 'format' | 'attachment'

export function ContentGenerationModal({
  open,
  onOpenChange,
  deal,
  onSuccess,
}: ContentGenerationModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('angle')
  const [angles, setAngles] = useState<{ title: string; description: string }[]>([])
  const [selectedAngle, setSelectedAngle] = useState<string>('')
  const [customAngleTitle, setCustomAngleTitle] = useState('')
  const [customAngleDescription, setCustomAngleDescription] = useState('')
  const [isAddingCustom, setIsAddingCustom] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<'email_sequence' | 'bundle' | ''>('')
  const [selectedAttachment, setSelectedAttachment] = useState<'case_study' | 'white_paper' | 'roi_calculator' | ''>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingAngles, setIsLoadingAngles] = useState(false)

  useEffect(() => {
    if (open) {
      loadAngles()
    }
  }, [open])

  const loadAngles = async () => {
    setIsLoadingAngles(true)
    try {
      const response = await fetch(`/api/deals/${deal.id}/generate-angles`)
      const data = await response.json()
      setAngles(data.angles || [])
    } catch (error) {
      console.error('Error loading angles:', error)
    } finally {
      setIsLoadingAngles(false)
    }
  }

  const handleAddCustomAngle = () => {
    if (!customAngleTitle || !customAngleDescription) {
      toast.error('Please fill in both title and description')
      return
    }

    setAngles([...angles, { title: customAngleTitle, description: customAngleDescription }])
    setSelectedAngle(customAngleTitle)
    setCustomAngleTitle('')
    setCustomAngleDescription('')
    setIsAddingCustom(false)
  }

  const handleNext = () => {
    if (step === 'angle' && selectedAngle) {
      setStep('format')
    } else if (step === 'format' && selectedFormat) {
      if (selectedFormat === 'bundle') {
        setStep('attachment')
      } else {
        handleGenerate()
      }
    }
  }

  const handleBack = () => {
    if (step === 'format') {
      setStep('angle')
    } else if (step === 'attachment') {
      setStep('format')
    }
  }

  const handleGenerate = async () => {
    if (!selectedAngle || !selectedFormat) return

    if (selectedFormat === 'bundle' && !selectedAttachment) {
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch(`/api/deals/${deal.id}/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          angle: selectedAngle,
          format: selectedFormat,
          attachmentType: selectedAttachment || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const generatedContent = await response.json()

      // Reset state
      setStep('angle')
      setSelectedAngle('')
      setSelectedFormat('')
      setSelectedAttachment('')
      onOpenChange(false)

      if (onSuccess) {
        onSuccess()
      }

      // Navigate to editor
      router.push(`/deals/${deal.id}/content/${generatedContent.id}`)
      toast.success('Content generated successfully!')
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Failed to generate content. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {step === 'angle' && (
          <>
            <DialogHeader>
              <DialogTitle>Select the angle for your content</DialogTitle>
              <DialogDescription>
                Choose a messaging angle that resonates with your prospect
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {isLoadingAngles ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-3">
                  {angles.map((angle, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAngle(angle.title)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedAngle === angle.title
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <h4 className="font-semibold mb-1">{angle.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {angle.description}
                      </p>
                    </button>
                  ))}

                  {isAddingCustom ? (
                    <div className="space-y-3 p-4 border-2 border-dashed rounded-lg">
                      <div>
                        <Label>Angle Title</Label>
                        <Input
                          value={customAngleTitle}
                          onChange={(e) => setCustomAngleTitle(e.target.value)}
                          placeholder="e.g., Technical Integration Focus"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={customAngleDescription}
                          onChange={(e) => setCustomAngleDescription(e.target.value)}
                          placeholder="Describe what this angle addresses..."
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddCustomAngle} size="sm">
                          Add
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAddingCustom(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingCustom(true)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Custom Angle
                    </Button>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleNext} disabled={!selectedAngle}>
                Next
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'format' && (
          <>
            <DialogHeader>
              <DialogTitle>Choose your content format</DialogTitle>
              <DialogDescription>
                Select how you want to deliver this content
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3">
              <button
                onClick={() => setSelectedFormat('email_sequence')}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedFormat === 'email_sequence'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <h4 className="font-semibold mb-1">Email Sequence</h4>
                <p className="text-sm text-muted-foreground">
                  3 personalized follow-up emails with suggested send timing
                </p>
              </button>

              <button
                onClick={() => setSelectedFormat('bundle')}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedFormat === 'bundle'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <h4 className="font-semibold mb-1">Bundle</h4>
                <p className="text-sm text-muted-foreground">
                  Email + supporting document (case study, white paper, or ROI calculator)
                </p>
              </button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!selectedFormat}>
                {selectedFormat === 'bundle' ? 'Next' : 'Generate'}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'attachment' && (
          <>
            <DialogHeader>
              <DialogTitle>Select attachment type</DialogTitle>
              <DialogDescription>
                Choose the type of document to include in your bundle
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Select
                value={selectedAttachment}
                onValueChange={(value) => setSelectedAttachment(value as typeof selectedAttachment)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select attachment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="case_study">Case Study</SelectItem>
                  <SelectItem value="white_paper">White Paper</SelectItem>
                  <SelectItem value="roi_calculator">ROI Calculator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!selectedAttachment || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
