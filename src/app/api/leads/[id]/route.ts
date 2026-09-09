import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser, isAdmin } from '@/lib/auth-helper';

const VALID_STATUSES = ['NEW', 'CONTACTED', 'CONVERTED', 'LOST'];

// PATCH /api/leads/[id] - Update lead status (Admin CRM follow-up)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}.` },
        { status: 400 }
      );
    }

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Lead not found.' },
        { status: 404 }
      );
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status }
    });

    console.log(`[AUDIT LOG] Lead status updated: id=${id} status=${status}`);

    return NextResponse.json(updatedLead, { status: 200 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to update lead:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id] - Remove a lead (Admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Lead not found.' },
        { status: 404 }
      );
    }

    await prisma.lead.delete({ where: { id } });
    console.log(`[AUDIT LOG] Lead deleted: id=${id}`);

    return NextResponse.json(
      { success: true, message: 'Lead deleted successfully.' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('[API ERROR] Failed to delete lead:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
