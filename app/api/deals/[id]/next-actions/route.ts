import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/deals/[id]/next-actions - Create a next action
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const nextAction = await prisma.nextAction.create({
      data: {
        dealId: params.id,
        description: body.description,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        isAiSuggested: body.isAiSuggested || false,
      },
    })

    return NextResponse.json(nextAction, { status: 201 })
  } catch (error) {
    console.error('Error creating next action:', error)
    return NextResponse.json(
      { error: 'Failed to create next action' },
      { status: 500 }
    )
  }
}
