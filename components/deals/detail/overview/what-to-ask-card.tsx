'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DealWithRelations } from '@/lib/types'

interface WhatToAskCardProps {
  deal: DealWithRelations
}

// Mock AI-generated questions based on deal stage
const getQuestionsByStage = (stage: string) => {
  const questionMap: Record<string, string[]> = {
    PROSPECTING: [
      "What's your current process for onboarding new sales reps?",
      "How long does it typically take for a new rep to become productive?",
      "What are your biggest challenges with sales enablement?",
      "Who else should be involved in evaluating this solution?",
    ],
    QUALIFIED: [
      "What's your budget allocation for sales enablement this quarter?",
      "What metrics would define success for this solution?",
      "When do you need this solution in place?",
      "Who are the key decision-makers we should involve?",
    ],
    DISCOVERY: [
      "Can you walk me through your current sales workflow?",
      "What integrations with your existing stack are critical?",
      "What security/compliance requirements do you have?",
      "What's your timeline for implementation?",
    ],
    PROPOSAL: [
      "Are there any concerns from stakeholders we should address?",
      "What would make this a no-brainer decision for you?",
      "How does this fit into your Q1 planning?",
      "What does your procurement process look like?",
    ],
    CLOSED: [
      "When would you like to start the implementation?",
      "Who will be our main point of contact during onboarding?",
      "Are there any immediate needs we should prioritize?",
    ],
  }

  return questionMap[stage] || questionMap.PROSPECTING
}

export function WhatToAskCard({ deal }: WhatToAskCardProps) {
  const [isGeneratingPrep, setIsGeneratingPrep] = useState(false)
  const questions = getQuestionsByStage(deal.stage)

  const handlePrepMeeting = () => {
    // This will be handled by the Meeting Prep Generation Flow (Component 3)
    setIsGeneratingPrep(true)
    // TODO: Open stakeholder selection modal
    console.log('Prep for next meeting clicked')
    setIsGeneratingPrep(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>What to Ask</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {questions.map((question, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-muted-foreground">•</span>
              <span className="text-sm">{question}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handlePrepMeeting}
          disabled={isGeneratingPrep}
        >
          {isGeneratingPrep ? 'Preparing...' : 'Prep for Next Meeting'}
        </Button>
      </CardFooter>
    </Card>
  )
}
