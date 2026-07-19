import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      select: {
        date: true,
        time: true
      }
    });
    return NextResponse.json(bookings, { status: 200 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to fetch bookings:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, date, time, platform, name, email, company, phone, description } = body;

    if (!topic || !date || !time || !name || !email || !company || !phone) {
      return NextResponse.json(
        { error: 'Topic, date, time, name, email, company, and phone are required.' },
        { status: 400 }
      );
    }

    // Check if already booked
    const existing = await prisma.booking.findFirst({
      where: { date, time }
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Slot waktu pada tanggal tersebut sudah dipesan oleh klien lain.' },
        { status: 400 }
      );
    }

    const newBooking = await prisma.booking.create({
      data: {
        topic,
        date,
        time,
        platform: platform || 'Google Meet',
        name,
        email,
        company,
        phone,
        description: description || ''
      }
    });

    // Auto-create lead so admin sees it in the dashboard
    try {
      await prisma.lead.create({
        data: {
          name,
          email,
          phone,
          company,
          role: 'Consultation Client',
          needs: `Konsultasi virtual dijadwalkan pada ${date} pukul ${time}. Topik: ${topic}. Platform: ${platform || 'Google Meet'}. Deskripsi: ${description || ''}`,
          budget: 'Unspecified',
          timeline: 'Unspecified',
          source: 'CONTACT',
          status: 'NEW'
        }
      });
    } catch (leadErr) {
      console.error('Failed to auto-create lead for booking:', leadErr);
    }

    return NextResponse.json({ success: true, bookingId: newBooking.id }, { status: 201 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to create booking:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
