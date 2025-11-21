"use strict";

type VerificationEmailParams = {
  name: string;
  verifyUrl: string;
};

export const buildVerificationEmail = ({
  name,
  verifyUrl,
}: VerificationEmailParams) => {
  const subject = "Verify your Smart Todo account";

  const html = `
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0f172a;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="540" style="background:#ffffff;border-radius:28px;padding:48px 40px;font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;">
          <tr>
            <td style="text-align:center;">
              <div style="display:inline-flex;width:60px;height:60px;border-radius:20px;background:linear-gradient(120deg,#6366f1,#ec4899);align-items:center;justify-content:center;font-size:28px;color:#fff;font-weight:700;">●</div>
              <h1 style="margin:24px 0 8px;font-size:28px;">Welcome to Smart Todo</h1>
              <p style="margin:0;font-size:16px;color:#475569;">Hi ${name}, let’s confirm it’s really you.</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:32px;">
              <p style="font-size:16px;line-height:1.6;color:#334155;">Click the button below to verify your email and unlock timers, analytics, and all of your tasks across every device.</p>
              <p style="text-align:center;margin:32px 0;">
                <a href="${verifyUrl}" target="_blank" rel="noopener"
                   style="display:inline-block;padding:14px 38px;background:linear-gradient(120deg,#4f46e5,#ec4899);color:#ffffff;border-radius:9999px;font-weight:600;text-decoration:none;font-size:16px;">
                  Verify my email
                </a>
              </p>
              <div style="padding:16px;border:1px solid #e2e8f0;border-radius:18px;background:#f8fafc;">
                <p style="margin:0 0 8px;font-size:14px;color:#475569;">Can’t click the button?</p>
                <p style="margin:0;font-size:14px;color:#0f172a;word-break:break-all;">${verifyUrl}</p>
              </div>
              <p style="margin-top:32px;font-size:13px;color:#94a3b8;">
                Didn’t request this email? You can safely ignore it and your account won’t be created.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:32px;text-align:center;font-size:13px;color:#94a3b8;">
              Smart Todo • Focused productivity, beautifully tracked.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;

  const text = `Welcome to Smart Todo, ${name}!

Verify your email: ${verifyUrl}

If you didn’t request this, you can ignore it.`;

  return { subject, html, text };
};
