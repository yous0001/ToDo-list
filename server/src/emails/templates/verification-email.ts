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
              <div style="display:inline-flex;width:70px;height:70px;border-radius:22px;background:#1f2937;align-items:center;justify-content:center;box-shadow:0 15px 30px rgba(15,23,42,0.35);">
                <svg width="38" height="44" viewBox="0 0 38 44" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="emailDoc" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stop-color="#6366f1"/>
                      <stop offset="1" stop-color="#ec4899"/>
                    </linearGradient>
                  </defs>
                  <rect x="4" y="2" width="26" height="40" rx="6" fill="url(#emailDoc)" />
                  <rect x="9" y="16" width="17" height="3" rx="1.5" fill="#f8fafc" />
                  <rect x="9" y="22" width="14" height="3" rx="1.5" fill="#f8fafc" />
                  <rect x="9" y="28" width="10" height="3" rx="1.5" fill="#f8fafc" />
                  <path d="M30 15c0-2.21-1.79-4-4-4h-3v12h7V15z" fill="#fde68a" opacity=".85" />
                </svg>
              </div>
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
