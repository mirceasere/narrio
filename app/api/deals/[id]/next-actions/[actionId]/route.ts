import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/deals/[id]/next-actions/[actionId] - Update a next action
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; actionId: string } }
) {
  try {
    const body = await request.json()

    const nextAction = await prisma.nextAction.update({
      where: { id: params.actionId },
      data: {
        isCompleted: body.isCompleted,
        completedAt: body.completedAt ? new Date(body.completedAt) : null,
      },
    })

    return NextResponse.json(nextAction)
  } catch (error) {
    console.error('Error updating next action:', error)
    return NextResponse.json(
      { error: 'Failed to update next action' },
      { status: 500 }
    )
  }
}

// DELETE /api/deals/[id]/next-actions/[actionId] - Delete a next action
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; actionId: string } }
) {
  try {
    await prisma.nextAction.delete({
      where: { id: params.actionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting next action:', error)
    return NextResponse.json(
      { error: 'Failed to delete next action' },
      { status: 500 }
    )
  }
}
