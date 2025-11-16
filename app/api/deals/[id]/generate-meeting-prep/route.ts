import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateMeetingPrep } from '@/lib/ai-service'

// POST /api/deals/[id]/generate-meeting-prep - Generate meeting prep
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { stakeholderIds } = body

    if (!stakeholderIds || stakeholderIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one stakeholder must be selected' },
        { status: 400 }
      )
    }

    // Fetch deal with all relations
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      include: {
        stakeholders: true,
        documents: true,
        nextActions: true,
        generatedContent: true,
        customAngles: true,
      },
    })

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    // Generate meeting prep using AI service
    const meetingPrepData = await generateMeetingPrep(deal, stakeholderIds)

    // Save generated content
    const generatedContent = await prisma.generatedContent.create({
      data: {
        dealId: params.id,
        type: 'MEETING_PREP',
        name: `Meeting Prep: ${meetingPrepData.stakeholderNames.join(', ')}`,
        angle: '',
        stakeholderNames: meetingPrepData.stakeholderNames.join(', '),
        content: JSON.stringify({ content: meetingPrepData.content }),
      },
    })

    return NextResponse.json(generatedContent, { status: 201 })
  } catch (error) {
    console.error('Error generating meeting prep:', error)
    return NextResponse.json(
      { error: 'Failed to generate meeting prep' },
      { status: 500 }
    )
  }
}
