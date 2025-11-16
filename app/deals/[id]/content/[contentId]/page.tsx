'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Download, Loader2, RefreshCw, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { GeneratedContent, GeneratedContentType } from '@prisma/client'
import { formatDate } from '@/lib/utils'

const contentTypeLabels: Record<GeneratedContentType, string> = {
  MEETING_PREP: 'Meeting Prep',
  EMAIL_SEQUENCE: 'Email Sequence',
  BUNDLE: 'Bundle',
}

export default function ContentEditorPage() {
  const params = useParams()
  const router = useRouter()
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editedContent, setEditedContent] = useState<any>(null)

  useEffect(() => {
    fetchContent()
  }, [params.id, params.contentId])

  const fetchContent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/deals/${params.id}`)
      const deal = await response.json()
      const foundContent = deal.generatedContent.find(
        (c: GeneratedContent) => c.id === params.contentId
      )
      if (foundContent) {
        setContent(foundContent)
        setEditedContent(JSON.parse(foundContent.content))
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content || !editedContent) return

    setIsSaving(true)
    try {
      const response = await fetch(
        `/api/deals/${params.id}/generated-content/${content.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: editedContent }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to save changes')
      }

      alert('Changes saved successfully!')
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = () => {
    if (!editedContent) return

    let textToCopy = ''
    if (content?.type === 'MEETING_PREP') {
      textToCopy = editedContent.content
    } else if (content?.type === 'EMAIL_SEQUENCE') {
      textToCopy = editedContent.emails
        .map(
          (email: any) =>
            `Email ${email.number}\nSubject: ${email.subject}\n\n${email.body}\n\nSuggested timing: ${email.suggestedTiming}\n\n---\n\n`
        )
        .join('')
    } else if (content?.type === 'BUNDLE') {
      textToCopy = `Subject: ${editedContent.email.subject}\n\n${editedContent.email.body}\n\n---\nAttachment:\n\n${editedContent.document.content}`
    }

    navigator.clipboard.writeText(textToCopy)
    alert('Copied to clipboard!')
  }

  const handleDownload = () => {
    if (!editedContent || !content) return

    let textToDownload = ''
    let filename = ''

    if (content.type === 'MEETING_PREP') {
      textToDownload = editedContent.content
      filename = `meeting-prep-${Date.now()}.txt`
    } else if (content.type === 'EMAIL_SEQUENCE') {
      textToDownload = editedContent.emails
        .map(
          (email: any) =>
            `Email ${email.number}\nSubject: ${email.subject}\n\n${email.body}\n\nSuggested timing: ${email.suggestedTiming}\n\n---\n\n`
        )
        .join('')
      filename = `email-sequence-${Date.now()}.txt`
    } else if (content.type === 'BUNDLE') {
      textToDownload = `Subject: ${editedContent.email.subject}\n\n${editedContent.email.body}\n\n---\nAttachment:\n\n${editedContent.document.content}`
      filename = `bundle-${Date.now()}.txt`
    }

    const blob = new Blob([textToDownload], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleRegenerate = () => {
    if (
      confirm(
        'This will create a new version using latest deal data. Continue?'
      )
    ) {
      // Regeneration would create a new item in the list
      // For now, we'll just show an alert
      alert(
        'Regenerate functionality will create a new version. Use the Generate buttons in the Generated Content tab instead.'
      )
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!content || !editedContent) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Content not found</h2>
          <Button onClick={() => router.push(`/deals/${params.id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/deals/${params.id}?tab=generated`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Deal
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{content.name}</h1>
              <Badge>{contentTypeLabels[content.type]}</Badge>
            </div>
            <p className="text-muted-foreground">
              Generated on {formatDate(content.createdAt)}
              {content.stakeholderNames && ` • ${content.stakeholderNames}`}
              {content.angle && ` • ${content.angle}`}
            </p>
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="space-y-6">
        {content.type === 'MEETING_PREP' && (
          <Card>
            <CardHeader>
              <CardTitle>Meeting Prep Document</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedContent.content}
                onChange={(e) =>
                  setEditedContent({ ...editedContent, content: e.target.value })
                }
                className="min-h-[600px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        )}

        {content.type === 'EMAIL_SEQUENCE' && (
          <div className="space-y-4">
            {editedContent.emails.map((email: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Email {email.number}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <input
                      type="text"
                      value={email.subject}
                      onChange={(e) => {
                        const newEmails = [...editedContent.emails]
                        newEmails[index].subject = e.target.value
                        setEditedContent({ ...editedContent, emails: newEmails })
                      }}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Body</label>
                    <Textarea
                      value={email.body}
                      onChange={(e) => {
                        const newEmails = [...editedContent.emails]
                        newEmails[index].body = e.target.value
                        setEditedContent({ ...editedContent, emails: newEmails })
                      }}
                      className="min-h-[200px] mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Suggested Timing
                    </label>
                    <input
                      type="text"
                      value={email.suggestedTiming}
                      onChange={(e) => {
                        const newEmails = [...editedContent.emails]
                        newEmails[index].suggestedTiming = e.target.value
                        setEditedContent({ ...editedContent, emails: newEmails })
                      }}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {content.type === 'BUNDLE' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <input
                    type="text"
                    value={editedContent.email.subject}
                    onChange={(e) =>
                      setEditedContent({
                        ...editedContent,
                        email: { ...editedContent.email, subject: e.target.value },
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Body</label>
                  <Textarea
                    value={editedContent.email.body}
                    onChange={(e) =>
                      setEditedContent({
                        ...editedContent,
                        email: { ...editedContent.email, body: e.target.value },
                      })
                    }
                    className="min-h-[200px] mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Document ({editedContent.document.type.replace('_', ' ')})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={editedContent.document.content}
                  onChange={(e) =>
                    setEditedContent({
                      ...editedContent,
                      document: {
                        ...editedContent.document,
                        content: e.target.value,
                      },
                    })
                  }
                  className="min-h-[400px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6 sticky bottom-4 bg-background p-4 border rounded-lg shadow-lg">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          )}
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" onClick={handleRegenerate}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Regenerate
        </Button>
      </div>
    </div>
  )
}
