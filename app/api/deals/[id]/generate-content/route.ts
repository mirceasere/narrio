import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateEmailSequence, generateBundle } from '@/lib/ai-service'

// POST /api/deals/[id]/generate-content - Generate email sequence or bundle
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { angle, format, attachmentType } = body

    if (!angle || !format) {
      return NextResponse.json(
        { error: 'Angle and format are required' },
        { status: 400 }
      )
    }

    if (format === 'bundle' && !attachmentType) {
      return NextResponse.json(
        { error: 'Attachment type is required for bundles' },
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

    let contentData: any
    let name: string
    let type: 'EMAIL_SEQUENCE' | 'BUNDLE'

    if (format === 'email_sequence') {
      contentData = await generateEmailSequence(deal, angle)
      name = `Email Sequence: ${angle}`
      type = 'EMAIL_SEQUENCE'
    } else {
      contentData = await generateBundle(deal, angle, attachmentType)
      name = `Bundle: ${angle} - ${attachmentType.replace('_', ' ')}`
      type = 'BUNDLE'
    }

    // Save generated content
    const generatedContent = await prisma.generatedContent.create({
      data: {
        dealId: params.id,
        type,
        name,
        angle,
        content: JSON.stringify(contentData),
      },
    })

    return NextResponse.json(generatedContent, { status: 201 })
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
