import nodemailer from "nodemailer";
import { config } from "../config/env.js";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!config.smtp.host) return null;
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
  });
  return transporter;
}

export async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();
  if (!t) {
    // Dev fallback: log the email so devs see verification/reset links.
    console.log(`\n[mailer:dev] → ${to}\nSubject: ${subject}\n${text ?? html}\n`);
    return;
  }
  await t.sendMail({ from: config.smtp.from, to, subject, html, text });
}
