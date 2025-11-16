import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DocumentType, DocumentSource } from '@prisma/client'

// POST /api/deals/[id]/documents - Create/upload a document
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const document = await prisma.document.create({
      data: {
        dealId: params.id,
        name: body.name,
        type: body.type as DocumentType,
        source: body.source || 'MANUAL' as DocumentSource,
        fileUrl: body.fileUrl || null,
        content: body.content || null,
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
}
