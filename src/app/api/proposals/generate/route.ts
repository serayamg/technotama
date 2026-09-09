import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateProposalWithAI } from '@/lib/gemini';
import { getAuthUser, isAdmin } from '@/lib/auth-helper';

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { proposalId, additionalInstructions } = body;

    if (!proposalId) {
      return NextResponse.json(
        { error: 'Proposal ID is required.' },
        { status: 400 }
      );
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId }
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal request not found.' },
        { status: 404 }
      );
    }

    // Generate using Gemini AI helper
    const aiResult = await generateProposalWithAI(
      {
        company: proposal.company,
        name: proposal.name,
        email: proposal.email,
        serviceType: proposal.serviceType,
        details: proposal.details,
        budget: proposal.budget,
        timeline: proposal.timeline,
        industry: proposal.industry || undefined,
        employees: proposal.employees || undefined,
        location: proposal.location || undefined
      },
      additionalInstructions
    );

    // Update proposal in database
    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        proposalTitle: aiResult.title,
        generatedContent: aiResult.content,
        status: 'REVIEWING' // update status to REVIEWING since we are drafting/building it
      }
    });

    return NextResponse.json({
      success: true,
      proposalId: updatedProposal.id,
      title: aiResult.title,
      content: aiResult.content,
      isFallback: aiResult.isFallback
    }, { status: 200 });

  } catch (err: any) {
    console.error('[API ERROR] Failed to generate proposal:', err);
    return NextResponse.json(
      { error: 'Failed to generate proposal due to an internal server error.' },
      { status: 500 }
    );
  }
}
