import { Event, PriceTier, PromoCode, SiteSetting } from '@prisma/client';
import { DateTime } from 'luxon';

type WithTiers = Event & { priceTiers: PriceTier[] };

export function formatCurrency(cents: number, currency = 'USD') {
  const value = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function centsToDollars(cents: number) {
  return cents / 100;
}

export function dollarsToCents(dollars: number) {
  return Math.round(dollars * 100);
}

export function getActivePriceTier(
  event: WithTiers,
  date: Date = new Date(),
  timezone = 'America/New_York',
) {
  const now = DateTime.fromJSDate(date).setZone(timezone);
  const activeTier = event.priceTiers.find((tier) => {
    const startsAt = tier.startsAt ? DateTime.fromJSDate(tier.startsAt).setZone(timezone) : null;
    const endsAt = tier.endsAt ? DateTime.fromJSDate(tier.endsAt).setZone(timezone) : null;

    if (startsAt && now < startsAt) {
      return false;
    }

    if (endsAt && now > endsAt) {
      return false;
    }

    return true;
  });

  return activeTier;
}

export interface PricingInput {
  event: WithTiers;
  quantity: number;
  addons: Array<{ price: number }>;
  promoCode?: PromoCode | null;
  timezone?: string;
}

export interface PricingResult {
  unitPrice: number;
  subtotal: number;
  serviceFee: number;
  tax: number;
  addonsTotal: number;
  total: number;
  appliedPromo?: {
    id: string;
    code: string;
    amount: number;
  };
}

export function computePricing({
  event,
  quantity,
  addons,
  promoCode,
  timezone = 'America/New_York',
}: PricingInput): PricingResult {
  if (quantity < 1) {
    throw new Error('Quantity must be at least 1.');
  }

  const activeTier = getActivePriceTier(event, new Date(), timezone);
  const unitPrice = activeTier ? activeTier.price : event.basePrice;
  const baseSubtotal = unitPrice * quantity;
  const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
  let subtotal = baseSubtotal + addonsTotal;

  let appliedPromo: PricingResult['appliedPromo'];
  if (promoCode) {
    let discount = 0;
    if (promoCode.percent) {
      discount = Math.round(subtotal * promoCode.percent);
    } else if (promoCode.amountOff) {
      discount = promoCode.amountOff;
    }

    subtotal = Math.max(0, subtotal - discount);
    appliedPromo = {
      id: promoCode.id,
      code: promoCode.code,
      amount: discount,
    };
  }

  const serviceFee = Math.round(subtotal * event.serviceFeePct);
  const taxableAmount = subtotal + serviceFee;
  const tax = Math.round(taxableAmount * event.taxPct);
  const total = taxableAmount + tax;

  return {
    unitPrice,
    subtotal,
    serviceFee,
    tax,
    addonsTotal,
    total,
    appliedPromo,
  };
}

export function formatDateTime(
  date: Date,
  { timezone = 'America/New_York', withTime = true }: { timezone?: string; withTime?: boolean } = {},
) {
  return DateTime.fromJSDate(date)
    .setZone(timezone)
    .toLocaleString({
      ...DateTime.DATETIME_MED,
      ...(withTime ? {} : { hour: undefined, minute: undefined }),
    });
}

export function formatToIsoForInput(date: Date, timezone = 'America/New_York') {
  return DateTime.fromJSDate(date).setZone(timezone).toISO();
}

export function getRefundCutoff(event: Event, setting?: SiteSetting | null) {
  const timezone = setting?.timezone ?? 'America/New_York';
  return DateTime.fromJSDate(event.dateTime)
    .setZone(timezone)
    .minus({ hours: event.cutoffHours });
}

