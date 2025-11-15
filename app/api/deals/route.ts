import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateDealInput } from '@/lib/types'
import { extractDomainFromEmail, extractCompanyFromDomain } from '@/lib/utils'

// GET /api/deals - List all deals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const stage = searchParams.get('stage')
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const where: any = {}

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { clientFullName: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (stage) {
      where.stage = stage
    }

    const deals = await prisma.deal.findMany({
      where,
      include: {
        nextActions: {
          where: { isCompleted: false },
        },
        _count: {
          select: { nextActions: true },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    })

    const dealsWithCount = deals.map(deal => ({
      ...deal,
      uncheckedNextActions: deal.nextActions.filter(a => !a.isCompleted).length,
    }))

    return NextResponse.json(dealsWithCount)
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}

// POST /api/deals - Create a new deal
export async function POST(request: NextRequest) {
  try {
    const body: CreateDealInput = await request.json()

    // Auto-fill logic
    let { clientWebsite, companyName } = body

    if (!clientWebsite && body.clientEmail) {
      clientWebsite = extractDomainFromEmail(body.clientEmail)
    }

    if (!companyName && clientWebsite) {
      companyName = extractCompanyFromDomain(clientWebsite)
    }

    const deal = await prisma.deal.create({
      data: {
        name: body.name,
        clientFullName: body.clientFullName,
        clientEmail: body.clientEmail,
        clientWebsite: clientWebsite || body.clientWebsite,
        companyName: companyName || body.companyName,
        dealValue: body.dealValue,
        stage: body.stage,
      },
    })

    // TODO: In production, trigger background jobs here:
    // 1. Match company to existing company identity
    // 2. Scrape contact's LinkedIn profile
    // 3. Generate initial meeting prep
    // 4. Suggest first next actions

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
  }
}
