import { NextResponse } from 'next/server';
import { z } from 'zod';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { computePricing } from '@/lib/pricing';
import { env } from '@/lib/env';
import { stripe } from '@/lib/stripe';

const createOrderSchema = z.object({
  eventId: z.string().cuid(),
  qty: z.number().int().min(1).max(10),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  licensePlate: z.string().optional(),
  notes: z.string().optional(),
  promoCode: z.string().optional(),
  addons: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid request', errors: parsed.error.flatten() }, { status: 400 });
    }

    const { eventId, addons, promoCode, qty, ...rest } = parsed.data;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        priceTiers: true,
        addons: true,
      },
    });

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    const availability = await prisma.order.aggregate({
      where: { eventId, status: 'PAID' },
      _sum: { qty: true },
    });
    const remaining = event.capacity - (availability._sum.qty ?? 0);

    if (remaining <= 0 || qty > remaining) {
      return NextResponse.json({ message: 'Not enough spots remaining' }, { status: 400 });
    }

    const selectedAddons = event.addons.filter((addon) => addons.includes(addon.id));

    let promo = null;
    if (promoCode) {
      promo = await prisma.promoCode.findUnique({
        where: { code: promoCode.toUpperCase() },
      });

      const now = new Date();
      const isExpired =
        !promo ||
        (promo.startsAt && promo.startsAt > now) ||
        (promo.endsAt && promo.endsAt < now) ||
        (promo.maxUses && promo.used >= promo.maxUses);

      if (isExpired) {
        promo = null;
      }
    }

    const pricing = computePricing({
      event,
      quantity: qty,
      addons: selectedAddons.map((addon) => ({ price: addon.price })),
      promoCode: promo ?? undefined,
    });

    const order = await prisma.order.create({
      data: {
        eventId: event.id,
        email: rest.email,
        firstName: rest.firstName,
        lastName: rest.lastName,
        phone: rest.phone,
        licensePlate: rest.licensePlate,
        specialNotes: rest.notes,
        qty,
        unitPrice: pricing.unitPrice,
        serviceFee: pricing.serviceFee,
        tax: pricing.tax,
        addonsTotal: pricing.addonsTotal,
        total: pricing.total,
        status: 'PENDING',
        promoCodeId: promo?.id,
        addons: {
          create: selectedAddons.map((addon) => ({
            addonId: addon.id,
            name: addon.name,
            price: addon.price,
          })),
        },
      },
    });

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: qty,
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${event.title} parking`,
            description: `Event on ${event.dateTime.toLocaleDateString()} at ${event.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          },
          unit_amount: pricing.unitPrice,
        },
      },
    ];

    if (pricing.addonsTotal > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Add-ons',
          },
          unit_amount: pricing.addonsTotal,
        },
      });
    }

    if (pricing.serviceFee > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Service fee',
          },
          unit_amount: pricing.serviceFee,
        },
      });
    }

    if (pricing.tax > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Estimated tax',
          },
          unit_amount: pricing.tax,
        },
      });
    }

    const successUrl = `${env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${env.NEXT_PUBLIC_SITE_URL}/cancel?order=${order.id}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: order.email,
      metadata: {
        orderId: order.id,
        eventId: event.id,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSession: session.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Unexpected error creating order' }, { status: 500 });
  }
}

