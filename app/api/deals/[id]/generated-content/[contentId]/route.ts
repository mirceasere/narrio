import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/deals/[id]/generated-content/[contentId] - Update generated content
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; contentId: string } }
) {
  try {
    const body = await request.json()

    const generatedContent = await prisma.generatedContent.update({
      where: { id: params.contentId },
      data: {
        content: body.content ? JSON.stringify(body.content) : undefined,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(generatedContent)
  } catch (error) {
    console.error('Error updating generated content:', error)
    return NextResponse.json(
      { error: 'Failed to update generated content' },
      { status: 500 }
    )
  }
}

// DELETE /api/deals/[id]/generated-content/[contentId] - Delete generated content
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; contentId: string } }
) {
  try {
    await prisma.generatedContent.delete({
      where: { id: params.contentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting generated content:', error)
    return NextResponse.json(
      { error: 'Failed to delete generated content' },
      { status: 500 }
    )
  }
}
