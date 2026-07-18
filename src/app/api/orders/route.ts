import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendProposalEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, serviceType, companyName, documentName, email, name, phone, projectDetails } = body;

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
        projectDetails: projectDetails ? sanitize(projectDetails) : null,
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

    // Send credentials email to the client
    if (email) {
      const emailHtml = `
        <p>Halo <strong>${name || 'Klien'}</strong>,</p>
        <p>Terima kasih telah mempercayakan kebutuhan keamanan siber Anda kepada <strong>PT Risetin Teknologi Indonesia (RTI) Neo</strong>.</p>
        <p>Pemesanan Anda untuk layanan <strong>${serviceType}</strong> dari perusahaan <strong>${companyName}</strong> telah berhasil kami terima dan terdaftar di sistem kami dengan Nomor Proyek: <strong>PROJ-${newOrder.id.substring(0, 8).toUpperCase()}</strong>.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 14px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Kredensial Portal Klien</h3>
          <p style="margin: 8px 0; font-size: 13px;"><strong>Alamat Email:</strong> ${email}</p>
          <p style="margin: 8px 0; font-size: 13px;"><strong>Password Default:</strong> <code style="background: #e2e8f0; padding: 2px 5px; border-radius: 4px;">clientpassword123</code></p>
          <p style="margin: 8px 0; font-size: 11px; color: #64748b; font-style: italic;">* Demi keamanan informasi, harap segera mengganti password Anda setelah berhasil melakukan login pertama kali.</p>
        </div>

        <p>Anda dapat menggunakan portal ini untuk mengunggah berkas scoping awal, memantau milestones pengerjaan proyek secara real-time, serta mengunduh dokumen penawaran (quotation) dan invoice resmi.</p>
        
        <p style="margin-top: 25px;">
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/portal" style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 13px;">
            Masuk ke Portal Klien
          </a>
        </p>

        <p style="margin-top: 30px;">Tim konsultan teknis kami akan menghubungi Anda dalam waktu 1x24 jam untuk koordinasi kickoff meeting dan tahap pengumpulan informasi awal.</p>
        <p>Salam hangat,<br/><strong>RTI Customer Success Team</strong></p>
      `;

      await sendProposalEmail({
        to: email,
        subject: `Aktivasi Akun Portal Klien RTI Neo - ${companyName}`,
        html: emailHtml
      }).catch(err => {
        console.error('[API ERROR] Failed to send activation email:', err);
      });
    }

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
