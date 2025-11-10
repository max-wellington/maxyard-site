import { Resend } from 'resend';
import { env } from './env';

export const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(options: { to: string; subject: string; react: React.ReactElement }) {
  if (!env.RESEND_API_KEY) {
    console.warn('Resend API key not configured; skipping email send.');
    return;
  }

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    react: options.react,
  });
}

