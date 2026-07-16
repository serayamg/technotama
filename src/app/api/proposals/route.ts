import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, industry, employees, location, serviceType, details, budget, timeline, fileName } = body;

    if (!name || !email || !phone || !company || !details || !serviceType) {
      return NextResponse.json(
        { error: 'Name, email, phone, company, service type, and details are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address format.' },
        { status: 400 }
      );
    }

    const sanitize = (val: string) => {
      if (!val) return '';
      return val
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    };

    const newProposal = await prisma.proposal.create({
      data: {
        name: sanitize(name),
        email: sanitize(email),
        phone: sanitize(phone),
        company: sanitize(company),
        industry: industry ? sanitize(industry) : 'Unspecified',
        employees: employees ? sanitize(employees) : 'Unspecified',
        location: location ? sanitize(location) : 'Unspecified',
        serviceType: sanitize(serviceType),
        details: sanitize(details),
        fileName: fileName ? sanitize(fileName) : null,
        filePath: fileName ? `/uploads/${sanitize(fileName)}` : null,
        budget: budget ? sanitize(budget) : 'Unspecified',
        timeline: timeline ? sanitize(timeline) : 'Unspecified',
        status: 'PENDING'
      }
    });

    console.log(`[AUDIT LOG] Proposal submitted: id=${newProposal.id} company=${newProposal.company} service=${newProposal.serviceType}`);

    return NextResponse.json(
      { success: true, proposalId: newProposal.id },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API ERROR] Failed to create proposal:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const proposals = await prisma.proposal.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(proposals, { status: 200 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to fetch proposals:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
