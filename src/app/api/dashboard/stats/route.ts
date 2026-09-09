import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // 1. Fetch counts
    const leadsCount = await prisma.lead.count();
    const proposalsCount = await prisma.proposal.count();
    const ordersCount = await prisma.order.count();
    const academyCount = await prisma.academyRegistration.count();
    const bookingsCount = await prisma.booking.count();

    // 2. Fetch converted status
    const convertedLeads = await prisma.lead.count({
      where: { status: 'CONVERTED' }
    });

    // 3. Fetch monthly order counts to generate charts
    const orders = await prisma.order.findMany();
    
    // Group orders for chart representation
    const serviceTypeDistribution = orders.reduce((acc: Record<string, number>, order) => {
      acc[order.serviceType] = (acc[order.serviceType] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(serviceTypeDistribution).map(([name, value]) => ({
      name,
      value
    }));

    // Mock conversion rate
    const totalLeadsAndProposals = leadsCount + proposalsCount;
    const conversionRate = totalLeadsAndProposals > 0 
      ? Math.round(((convertedLeads + ordersCount) / totalLeadsAndProposals) * 100) 
      : 0;

    // 4. Build real recent activity feed from the latest records
    const [recentLeads, recentProposals, recentOrders] = await Promise.all([
      prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.proposal.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 3 })
    ]);

    const activityItems = [
      ...recentLeads.map((l) => ({
        type: 'lead',
        title: `Lead baru dari ${l.source}`,
        detail: `${l.name} (${l.company})`,
        at: l.createdAt
      })),
      ...recentProposals.map((p) => ({
        type: 'proposal',
        title: 'Permintaan proposal masuk',
        detail: `${p.name} (${p.company})`,
        at: p.createdAt
      })),
      ...recentOrders.map((o) => ({
        type: 'order',
        title: 'Pemesanan layanan baru',
        detail: `${o.companyName} (${o.serviceType})`,
        at: o.createdAt
      }))
    ]
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 6)
      .map((item, idx) => ({ id: idx + 1, ...item }));

    return NextResponse.json({
      leadsCount,
      proposalsCount,
      ordersCount,
      academyCount,
      bookingsCount,
      conversionRate: `${conversionRate}%`,
      chartData,
      recentActivity: activityItems
    }, { status: 200 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to fetch dashboard stats:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
