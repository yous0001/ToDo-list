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
    <div style="font-family:Arial,Helvetica,sans-serif;padding:24px;background:#f8fafc;color:#0f172a">
      <h2 style="margin-bottom:16px;">Welcome, ${name}!</h2>
      <p style="margin-bottom:16px;">
        Thanks for joining Smart Todo. Please verify your email to start tracking tasks across devices.
      </p>
      <p style="margin-bottom:24px;text-align:center;">
        <a href="${verifyUrl}" target="_blank" rel="noopener"
          style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#ffffff;border-radius:9999px;text-decoration:none;font-weight:600;">
          Verify email
        </a>
      </p>
      <p style="font-size:14px;color:#475569;">
        Or copy and paste this link into your browser:<br />
        <span style="word-break:break-all;">${verifyUrl}</span>
      </p>
      <p style="margin-top:24px;font-size:13px;color:#94a3b8;">
        If you didn’t create this account, you can ignore this email.
      </p>
    </div>
  `;
  const text = `Welcome, ${name}!\n\nVerify your Smart Todo account: ${verifyUrl}\n\nIf you didn’t create this account, you can ignore this email.`;

  return { subject, html, text };
};
