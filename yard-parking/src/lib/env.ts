import { z } from 'zod';

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

function safeParse<T extends z.ZodTypeAny>(schema: T, data: Record<string, unknown>) {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error('Environment variable validation failed', result.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }
  return result.data;
}

export const env = safeParse(serverSchema, process.env);
export const clientEnv = safeParse(clientSchema, {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

