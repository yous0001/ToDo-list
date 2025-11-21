import nodemailer from "nodemailer";

import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.mail.host,
  service: "gmail",
  port: env.mail.port,
  secure: env.mail.port === 465,
  auth: {
    user: env.mail.user,
    pass: env.mail.pass,
  },
});

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export const sendMail = async ({
  to,
  subject,
  html,
  text,
}: SendMailOptions) => {
  await transporter.sendMail({
    from: env.mail.from,
    to,
    subject,
    html,
    text,
  });
};

