import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendProposalEmail } from '@/lib/mailer';
import { getAuthUser, isAdmin } from '@/lib/auth-helper';

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { proposalId, emailSubject, emailBody, toEmail } = body;

    if (!proposalId || !emailSubject || !emailBody || !toEmail) {
      return NextResponse.json(
        { error: 'Proposal ID, email subject, email body, and destination email are required.' },
        { status: 400 }
      );
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId }
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal request not found.' },
        { status: 404 }
      );
    }

    // Wrap the email body in a professional Technotama template
    const fullHtmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #334155;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
    }
    .wrapper {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #0f172a;
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.025em;
    }
    .header p {
      margin: 5px 0 0 0;
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .content {
      padding: 30px;
      font-size: 14px;
    }
    .content h1, .content h2, .content h3 {
      color: #0f172a;
      margin-top: 24px;
    }
    .content h1 { font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    .content h2 { font-size: 16px; }
    .content p { margin-bottom: 16px; }
    .content ul, .content ol { margin-bottom: 16px; padding-left: 20px; }
    .content li { margin-bottom: 8px; }
    .content table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
    }
    .content th, .content td {
      border: 1px solid #e2e8f0;
      padding: 10px;
      text-align: left;
    }
    .content th {
      background-color: #f1f5f9;
      font-weight: bold;
      color: #334155;
    }
    .footer {
      background-color: #f8fafc;
      border-t: 1px solid #e2e8f0;
      padding: 20px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
    .footer p { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>RISETIN TEKNOLOGI INDONESIA</h1>
      <p>Cybersecurity & Technology Strategy Consulting</p>
    </div>
    <div class="content">
      ${emailBody}
    </div>
    <div class="footer">
      <p><strong>PT Risetin Teknologi Indonesia (Technotama) Neo</strong></p>
      <p>Gedung Cyber, Kuningan Barat, Jakarta Selatan, Indonesia</p>
      <p>Website: <a href="https://risetin.co.id" style="color: #2563eb; text-decoration: none;">risetin.co.id</a> | Email: customercare@technotama.co.id</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send the email
    const mailResult = await sendProposalEmail({
      to: toEmail,
      subject: emailSubject,
      html: fullHtmlBody
    });

    if (mailResult.success) {
      // Update proposal state in database
      await prisma.proposal.update({
        where: { id: proposalId },
        data: {
          proposalTitle: emailSubject,
          generatedContent: emailBody, // save the plain generated text as edited
          status: 'SENT',
          sentAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        simulated: mailResult.simulated,
        logPath: mailResult.logPath,
        error: mailResult.error
      }, { status: 200 });
    } else {
      return NextResponse.json({
        error: mailResult.error || 'Failed to dispatch email.'
      }, { status: 500 });
    }

  } catch (err: any) {
    console.error('[API ERROR] Failed to send proposal email:', err);
    return NextResponse.json(
      { error: 'Failed to send proposal email due to an internal server error.' },
      { status: 500 }
    );
  }
}
