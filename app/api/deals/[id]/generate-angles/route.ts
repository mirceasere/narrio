import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateAngles } from '@/lib/ai-service'

// GET /api/deals/[id]/generate-angles - Generate AI angles
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const angles = await generateAngles(deal)

    return NextResponse.json({ angles })
  } catch (error) {
    console.error('Error generating angles:', error)
    return NextResponse.json(
      { error: 'Failed to generate angles' },
      { status: 500 }
    )
  }
}
