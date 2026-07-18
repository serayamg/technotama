import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

function getDynamicSMTPConfig() {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/site-content.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      const config = JSON.parse(data);
      if (config.integrations) {
        return {
          host: config.integrations.smtpHost || process.env.SMTP_HOST,
          port: config.integrations.smtpPort ? parseInt(config.integrations.smtpPort) : (process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587),
          user: config.integrations.smtpUser || process.env.SMTP_USER,
          pass: config.integrations.smtpPassword || process.env.SMTP_PASSWORD,
          from: config.integrations.smtpFrom || process.env.SMTP_FROM || 'customercare@risetin.co.id'
        };
      }
    }
  } catch (err) {
    console.error('Failed to read dynamic SMTP config:', err);
  }
  return {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM || 'customercare@risetin.co.id'
  };
}

export async function sendProposalEmail(options: MailOptions): Promise<{ success: boolean; simulated: boolean; error?: string; logPath?: string }> {
  const { to, subject, html, text } = options;

  const { host, port, user, pass, from } = getDynamicSMTPConfig();

  const isSMTPConfigured = typeof host === 'string' && host.trim().length > 0 && 
                            typeof user === 'string' && user.trim().length > 0;

  if (isSMTPConfigured) {
    try {
      console.log(`[MAILER] Dispatching real email to ${to} via SMTP: ${host}:${port}`);
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });

      await transporter.sendMail({
        from: `"RTI Customer Care Team" <${from}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // basic strip html tags for text fallback
      });

      return { success: true, simulated: false };
    } catch (err: any) {
      console.error('[MAILER ERROR] Failed to send real email via SMTP:', err);
      // Fallback to simulation if email fails so the system doesn't crash
      const logInfo = saveSimulationLog(to, subject, html, err.message);
      return { 
        success: true, 
        simulated: true, 
        error: `SMTP Error: ${err.message}. Layanan dialihkan ke Mode Simulasi.`,
        logPath: logInfo.logPath 
      };
    }
  } else {
    console.log(`[MAILER] SMTP is not configured. Saving simulation record for email to ${to}`);
    const logInfo = saveSimulationLog(to, subject, html);
    return { success: true, simulated: true, logPath: logInfo.logPath };
  }
}

function saveSimulationLog(to: string, subject: string, html: string, smtpError?: string) {
  const timestamp = new Date().toISOString();
  const logDir = path.join(process.cwd(), 'public', 'logs');
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFileName = `email-simulation-${Date.now()}.html`;
  const logPath = path.join(logDir, logFileName);

  const logContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Email Simulation Log</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #334155; }
    .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; line-height: 1.6; }
    .meta-title { font-weight: bold; color: #1e293b; display: inline-block; width: 100px; }
    .email-body { border: 1px solid #e2e8f0; padding: 30px; border-radius: 8px; background: #ffffff; }
    .smtp-warning { color: #b45309; background: #fffbeb; border: 1px solid #fef3c7; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-weight: 500; }
  </style>
</head>
<body>
  <h2>Simulasi Pengiriman Email RTI Neo</h2>
  <div class="meta-box">
    ${smtpError ? `<div class="smtp-warning">⚠️ Gagal terhubung ke server SMTP (${smtpError}). Email disimulasikan secara aman di bawah ini.</div>` : '<div>ℹ️ Email dikirimkan dalam mode simulasi karena SMTP belum dikonfigurasi di file .env.</div>'}
    <div><span class="meta-title">Waktu:</span> ${timestamp}</div>
    <div><span class="meta-title">Kepada:</span> &lt;${to}&gt;</div>
    <div><span class="meta-title">Subjek:</span> <strong>${subject}</strong></div>
    <div><span class="meta-title">Status:</span> SIMULATED SUCCESS</div>
  </div>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;">
  <div class="email-body">
    ${html}
  </div>
</body>
</html>
  `;

  fs.writeFileSync(logPath, logContent, 'utf-8');
  console.log(`[MAILER] Email simulation log saved at: ${logPath}`);
  
  return { logPath: `/logs/${logFileName}`, absolutePath: logPath };
}
