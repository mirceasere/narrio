'use client'

import { useState } from 'react'
import { Plus, X, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DealWithRelations } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface NextActionsCardProps {
  deal: DealWithRelations
  onUpdate: () => void
}

export function NextActionsCard({ deal, onUpdate }: NextActionsCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newAction, setNewAction] = useState('')
  const [newActionDate, setNewActionDate] = useState('')

  const handleToggleAction = async (actionId: string, isCompleted: boolean) => {
    try {
      await fetch(`/api/deals/${deal.id}/next-actions/${actionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isCompleted: !isCompleted,
          completedAt: !isCompleted ? new Date().toISOString() : null,
        }),
      })
      onUpdate()
    } catch (error) {
      console.error('Error toggling action:', error)
    }
  }

  const handleRemoveAction = async (actionId: string) => {
    try {
      await fetch(`/api/deals/${deal.id}/next-actions/${actionId}`, {
        method: 'DELETE',
      })
      onUpdate()
    } catch (error) {
      console.error('Error removing action:', error)
    }
  }

  const handleAddAction = async () => {
    if (!newAction.trim()) return

    try {
      await fetch(`/api/deals/${deal.id}/next-actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newAction,
          dueDate: newActionDate || null,
          isAiSuggested: false,
        }),
      })
      setNewAction('')
      setNewActionDate('')
      setIsAdding(false)
      onUpdate()
    } catch (error) {
      console.error('Error adding action:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {deal.nextActions.map((action) => (
            <div
              key={action.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <Checkbox
                checked={action.isCompleted}
                onCheckedChange={() =>
                  handleToggleAction(action.id, action.isCompleted)
                }
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm ${
                    action.isCompleted
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {action.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {action.dueDate && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(action.dueDate)}
                    </span>
                  )}
                  {action.isAiSuggested && (
                    <Badge variant="secondary" className="text-xs">
                      AI Suggested
                    </Badge>
                  )}
                </div>
              </div>
              {action.isAiSuggested && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveAction(action.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {deal.nextActions.length === 0 && !isAdding && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No next actions yet. Add one below.
            </p>
          )}

          {isAdding ? (
            <div className="space-y-3 p-3 border rounded-lg">
              <Input
                placeholder="Enter action description..."
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddAction()
                  if (e.key === 'Escape') {
                    setIsAdding(false)
                    setNewAction('')
                    setNewActionDate('')
                  }
                }}
                autoFocus
              />
              <Input
                type="date"
                placeholder="Due date (optional)"
                value={newActionDate}
                onChange={(e) => setNewActionDate(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddAction} size="sm">
                  Add
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false)
                    setNewAction('')
                    setNewActionDate('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Manual Action
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
