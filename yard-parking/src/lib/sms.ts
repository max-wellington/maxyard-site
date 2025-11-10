import twilio from 'twilio';
import { env } from './env';

let client: twilio.Twilio | null = null;

function getClient() {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER) {
    return null;
  }

  if (!client) {
    client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  }

  return client;
}

export async function sendSms(to: string, body: string) {
  const twilioClient = getClient();
  if (!twilioClient) {
    console.info('Twilio not configured; skipping SMS send.');
    return;
  }

  await twilioClient.messages.create({
    to,
    from: env.TWILIO_FROM_NUMBER!,
    body,
  });
}

