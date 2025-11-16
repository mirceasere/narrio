import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE /api/deals/[id]/documents/[documentId] - Delete a document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; documentId: string } }
) {
  try {
    // Check if document is from HubSpot (cannot delete)
    const document = await prisma.document.findUnique({
      where: { id: params.documentId },
    })

    if (document?.source === 'HUBSPOT') {
      return NextResponse.json(
        { error: 'Cannot delete HubSpot-synced documents' },
        { status: 403 }
      )
    }

    await prisma.document.delete({
      where: { id: params.documentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}
