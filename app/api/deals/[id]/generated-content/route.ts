import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { GeneratedContentType } from '@prisma/client'

// POST /api/deals/[id]/generated-content - Create generated content
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const generatedContent = await prisma.generatedContent.create({
      data: {
        dealId: params.id,
        type: body.type as GeneratedContentType,
        name: body.name,
        angle: body.angle || '',
        stakeholderNames: body.stakeholderNames || null,
        content: JSON.stringify(body.contentData),
      },
    })

    return NextResponse.json(generatedContent, { status: 201 })
  } catch (error) {
    console.error('Error creating generated content:', error)
    return NextResponse.json(
      { error: 'Failed to create generated content' },
      { status: 500 }
    )
  }
}
