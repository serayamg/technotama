import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser, isAdmin } from '@/lib/auth-helper';

const VALID_STATUSES = [
  'ORDERED', 'DOC_UPLOADED', 'QUOTATION_GENERATED', 'APPROVED',
  'INVOICED', 'PAID', 'COMPLETED'
];
const VALID_STAGES = ['DISCOVER', 'ASSESS', 'DESIGN', 'IMPLEMENT', 'VALIDATE', 'TRAIN', 'SUPPORT'];
const VALID_PROGRESS_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

// PATCH /api/orders/[id] - Update order status and/or a project progress milestone (Admin)
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
    const { status, stage, stageStatus } = body;

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Order not found.' },
        { status: 404 }
      );
    }

    // Update order status if provided
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}.` },
          { status: 400 }
        );
      }
      await prisma.order.update({
        where: { id },
        data: { status }
      });
    }

    // Update a specific project progress milestone if provided
    if (stage !== undefined || stageStatus !== undefined) {
      if (!VALID_STAGES.includes(stage) || !VALID_PROGRESS_STATUSES.includes(stageStatus)) {
        return NextResponse.json(
          { error: 'Invalid stage or stage status value.' },
          { status: 400 }
        );
      }
      const milestone = await prisma.projectProgress.findFirst({
        where: { orderId: id, stage }
      });
      if (milestone) {
        await prisma.projectProgress.update({
          where: { id: milestone.id },
          data: { status: stageStatus }
        });
      } else {
        await prisma.projectProgress.create({
          data: { orderId: id, stage, status: stageStatus }
        });
      }
    }

    console.log(`[AUDIT LOG] Order updated: id=${id} status=${status ?? '-'} stage=${stage ?? '-'}`);

    const updated = await prisma.order.findUnique({ where: { id } });
    const progress = await prisma.projectProgress.findMany({ where: { orderId: id } });

    return NextResponse.json({ ...updated, progress }, { status: 200 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to update order:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
