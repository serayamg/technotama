import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { proposalId, title, content } = body;

    if (!proposalId) {
      return NextResponse.json(
        { error: 'Proposal ID is required.' },
        { status: 400 }
      );
    }

    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        proposalTitle: title,
        generatedContent: content,
        status: 'REVIEWING' // set to reviewing since it is being edited
      }
    });

    return NextResponse.json({
      success: true,
      proposalId: updatedProposal.id
    }, { status: 200 });

  } catch (err: any) {
    console.error('[API ERROR] Failed to save proposal draft:', err);
    return NextResponse.json(
      { error: 'Failed to save proposal draft due to an internal server error.' },
      { status: 500 }
    );
  }
}
