import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/deals/[id]/stakeholders/[stakeholderId] - Update a stakeholder
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; stakeholderId: string } }
) {
  try {
    const body = await request.json()

    const stakeholder = await prisma.stakeholder.update({
      where: { id: params.stakeholderId },
      data: {
        fullName: body.fullName,
        companyRole: body.companyRole,
        email: body.email,
        linkedinUrl: body.linkedinUrl || null,
        buyerTypes: body.buyerTypes || [],
      },
    })

    return NextResponse.json(stakeholder)
  } catch (error) {
    console.error('Error updating stakeholder:', error)
    return NextResponse.json(
      { error: 'Failed to update stakeholder' },
      { status: 500 }
    )
  }
}

// DELETE /api/deals/[id]/stakeholders/[stakeholderId] - Delete a stakeholder
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; stakeholderId: string } }
) {
  try {
    await prisma.stakeholder.delete({
      where: { id: params.stakeholderId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting stakeholder:', error)
    return NextResponse.json(
      { error: 'Failed to delete stakeholder' },
      { status: 500 }
    )
  }
}
