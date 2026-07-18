import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, background, bootcampLevel, certRequired, prepRequired } = body;

    // Input Validation
    if (!name || !email || !phone || !background || !bootcampLevel || !certRequired || !prepRequired) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format alamat email tidak valid.' },
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

    // Save into database
    const registration = await prisma.academyRegistration.create({
      data: {
        name: sanitize(name),
        email: sanitize(email),
        phone: sanitize(phone),
        background: sanitize(background),
        bootcampLevel: sanitize(bootcampLevel),
        certRequired: sanitize(certRequired),
        prepRequired: sanitize(prepRequired)
      }
    });

    console.log(`[AUDIT LOG] Academy registration created: id=${registration.id} email=${registration.email}`);

    return NextResponse.json(
      { success: true, registrationId: registration.id },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API ERROR] Failed to create academy registration:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}
