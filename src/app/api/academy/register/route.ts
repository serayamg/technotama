import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      classOption,
      participantType,
      name,
      nikPaspor,
      birthPlaceDate,
      gender,
      address,
      domicile,
      email,
      phone,
      linkedin,
      github,
      educationLevel,
      school,
      major,
      gpa,
      employmentStatus,
      workCompany,
      workJobTitle,
      workDuration,
      workDescription,
      itExperience,
      cyberExperience,
      certifications,
      bootcampGoals,
      packageOption,
      uploadedDocuments,
      paymentMethod,
      signatureName,
      signatureDate,
      corpName,
      corpPic,
      corpJobTitle
    } = body;

    // Input Validation
    if (
      !classOption ||
      !participantType ||
      !name ||
      !nikPaspor ||
      !birthPlaceDate ||
      !gender ||
      !address ||
      !domicile ||
      !email ||
      !phone ||
      !linkedin ||
      !educationLevel ||
      !school ||
      !major ||
      !employmentStatus ||
      !packageOption ||
      !paymentMethod ||
      !signatureName ||
      !signatureDate
    ) {
      return NextResponse.json(
        { error: 'Semua field wajib bagian A, B, C, I, K, dan Q wajib diisi.' },
        { status: 400 }
      );
    }

    if (participantType === 'Corporate' && (!corpName || !corpPic || !corpJobTitle)) {
      return NextResponse.json(
        { error: 'Untuk jenis peserta Corporate, informasi perusahaan (bagian Q) wajib diisi lengkap.' },
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

    const sanitize = (val: any) => {
      if (val === undefined || val === null) return '';
      if (typeof val !== 'string') return JSON.stringify(val);
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
        classOption: sanitize(classOption),
        participantType: sanitize(participantType),
        name: sanitize(name),
        nikPaspor: sanitize(nikPaspor),
        birthPlaceDate: sanitize(birthPlaceDate),
        gender: sanitize(gender),
        address: sanitize(address),
        domicile: sanitize(domicile),
        email: sanitize(email),
        phone: sanitize(phone),
        linkedin: sanitize(linkedin),
        github: sanitize(github),
        educationLevel: sanitize(educationLevel),
        school: sanitize(school),
        major: sanitize(major),
        gpa: sanitize(gpa),
        employmentStatus: sanitize(employmentStatus),
        workCompany: sanitize(workCompany),
        workJobTitle: sanitize(workJobTitle),
        workDuration: sanitize(workDuration),
        workDescription: sanitize(workDescription),
        itExperience: sanitize(itExperience),
        cyberExperience: sanitize(cyberExperience),
        certifications: sanitize(certifications),
        bootcampGoals: sanitize(bootcampGoals),
        packageOption: sanitize(packageOption),
        uploadedDocuments: sanitize(uploadedDocuments),
        paymentMethod: sanitize(paymentMethod),
        signatureName: sanitize(signatureName),
        signatureDate: sanitize(signatureDate),
        corpName: sanitize(corpName),
        corpPic: sanitize(corpPic),
        corpJobTitle: sanitize(corpJobTitle)
      }
    });

    console.log(`[AUDIT LOG] Comprehensive academy registration created: id=${registration.id} email=${registration.email}`);

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
