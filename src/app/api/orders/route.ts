import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, serviceType, companyName, documentName } = body;

    if (!serviceType || !companyName) {
      return NextResponse.json(
        { error: 'Service type and company name are required.' },
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

    // Create Order
    const newOrder = await prisma.order.create({
      data: {
        clientId: clientId || null,
        serviceType: sanitize(serviceType),
        companyName: sanitize(companyName),
        status: documentName ? 'DOC_UPLOADED' : 'ORDERED',
        // Mock generation of files
        quotationPath: `/orders/QT-${Math.floor(1000 + Math.random() * 9000)}.pdf`,
        invoicePath: `/orders/INV-${Math.floor(1000 + Math.random() * 9000)}.pdf`
      }
    });

    // Create default project progress milestones
    const stages = ['DISCOVER', 'ASSESS', 'DESIGN', 'IMPLEMENT', 'VALIDATE', 'TRAIN', 'SUPPORT'];
    const progressData = stages.map((stage, idx) => ({
      orderId: newOrder.id,
      stage,
      status: idx === 0 ? 'COMPLETED' : idx === 1 ? 'IN_PROGRESS' : 'PENDING'
    }));

    await prisma.projectProgress.createMany({
      data: progressData
    });

    console.log(`[AUDIT LOG] Order created: id=${newOrder.id} company=${newOrder.companyName} service=${newOrder.serviceType}`);

    return NextResponse.json(
      { success: true, orderId: newOrder.id },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API ERROR] Failed to create order:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    let orders;
    if (clientId) {
      orders = await prisma.order.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }

    // Include progress milestones for each order
    const ordersWithProgress = await Promise.all(
      orders.map(async (order) => {
        const progress = await prisma.projectProgress.findMany({
          where: { orderId: order.id }
        });
        return {
          ...order,
          progress
        };
      })
    );

    return NextResponse.json(ordersWithProgress, { status: 200 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to fetch orders:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
