import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BuyerType } from '@prisma/client'

// POST /api/deals/[id]/stakeholders - Create a stakeholder
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const stakeholder = await prisma.stakeholder.create({
      data: {
        dealId: params.id,
        fullName: body.fullName,
        companyRole: body.companyRole,
        email: body.email,
        linkedinUrl: body.linkedinUrl || null,
        buyerTypes: body.buyerTypes || [],
      },
    })

    return NextResponse.json(stakeholder, { status: 201 })
  } catch (error) {
    console.error('Error creating stakeholder:', error)
    return NextResponse.json(
      { error: 'Failed to create stakeholder' },
      { status: 500 }
    )
  }
}
