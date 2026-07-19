import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser, isAdmin } from '@/lib/auth-helper';

// POST /api/leads - Create a new lead from Chatbot or Forms
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, role, needs, budget, timeline, source } = body;

    // Basic Input Validation & Sanitization
    if (!name || !email || !phone || !company || !needs) {
      return NextResponse.json(
        { error: 'Name, email, phone, company, and needs are required fields.' },
        { status: 400 }
      );
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address format.' },
        { status: 400 }
      );
    }

    // Output Encoding/Sanitization helper (OWASP XSS mitigation)
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

    // Save lead into database
    const newLead = await prisma.lead.create({
      data: {
        name: sanitize(name),
        email: sanitize(email),
        phone: sanitize(phone),
        company: sanitize(company),
        role: role ? sanitize(role) : 'Client',
        needs: sanitize(needs),
        budget: budget ? sanitize(budget) : 'Unspecified',
        timeline: timeline ? sanitize(timeline) : 'Unspecified',
        source: source ? sanitize(source) : 'CONTACT',
        status: 'NEW'
      }
    });

    // Security Audit Log (OWASP logging mitigation)
    console.log(`[AUDIT LOG] Lead created: id=${newLead.id} company=${newLead.company} email=${newLead.email} source=${newLead.source}`);

    return NextResponse.json(
      { success: true, leadId: newLead.id },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API ERROR] Failed to create lead:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}

// GET /api/leads - Fetch all leads for Admin CMS Dashboard
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(leads, { status: 200 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to fetch leads:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
