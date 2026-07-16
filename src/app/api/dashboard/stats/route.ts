import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // 1. Fetch counts
    const leadsCount = await prisma.lead.count();
    const proposalsCount = await prisma.proposal.count();
    const ordersCount = await prisma.order.count();

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

    return NextResponse.json({
      leadsCount,
      proposalsCount,
      ordersCount,
      conversionRate: `${conversionRate}%`,
      chartData,
      recentActivity: [
        { id: 1, type: 'lead', title: 'Lead baru masuk dari Chatbot', detail: 'Siti Rahmawati (AJS Kitabisa)' },
        { id: 2, type: 'proposal', title: 'Proposal masuk', detail: 'Budi Santoso (Bank Sumsel Babel)' },
        { id: 3, type: 'order', title: 'Pemesanan layanan baru', detail: 'PT Bank DKI (VAPT)' }
      ]
    }, { status: 200 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to fetch dashboard stats:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
