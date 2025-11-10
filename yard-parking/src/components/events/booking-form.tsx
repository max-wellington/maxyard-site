"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event, EventAddon, PriceTier } from "@prisma/client";
import { computePricing, formatCurrency } from "@/lib/pricing";
import { DEFAULT_TIMEZONE, formatDate, formatTime } from "@/lib/datetime";

const bookingSchema = z.object({
  qty: z.coerce.number().int().min(1, "Select at least one spot"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  licensePlate: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  notes: z
    .string()
    .max(500, "Keep special instructions under 500 characters")
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  promoCode: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim().toUpperCase() : undefined)),
  addons: z.array(z.string()).default([]),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  event: Event & { priceTiers: PriceTier[]; addons: EventAddon[] };
  availability: {
    available: number;
    sold: number;
    capacity: number;
  };
  timezone?: string;
  nextTier?: PriceTier;
}

export function BookingForm({ event, availability, timezone = DEFAULT_TIMEZONE, nextTier }: BookingFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPromoBox, setShowPromoBox] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      qty: availability.available > 0 ? 1 : 0,
      addons: [],
    },
  });

  const qty = form.watch("qty") || 0;
  const maxSelectable = Math.min(availability.available, 6);
  const selectedAddons = form.watch("addons");
  const promoCode = form.watch("promoCode");

  const pricing = useMemo(() => {
    try {
      const addons = event.addons
        .filter((addon) => selectedAddons.includes(addon.id))
        .map((addon) => ({ price: addon.price }));
      return computePricing({
        event,
        quantity: qty || 0,
        addons,
        promoCode: undefined,
        timezone,
      });
    } catch (error) {
      return null;
    }
  }, [event, qty, selectedAddons, timezone]);

  const reserve = (values: BookingFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          ...values,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        setServerError(error?.message ?? "Unable to create reservation. Please try again.");
        return;
      }

      const data = await response.json();
      window.location.href = data.url;
    });
  };

  const soldOut = availability.available <= 0;

  return (
    <div className="card space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Reserve & pay</h2>
        <p className="mt-2 text-sm text-slate-600">
          Choose how many vehicles to bring, add any extras, then checkout securely via Stripe.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">{formatDate(event.dateTime, timezone)}</p>
        <p className="mt-1 text-slate-600">
          Start time {formatTime(event.dateTime, timezone)} • Arrive within your arrival window
        </p>
      </div>

      <form onSubmit={form.handleSubmit(reserve)} className="space-y-6">
        <fieldset className="space-y-3" disabled={soldOut || isPending}>
          <legend className="text-sm font-semibold text-slate-700">How many spots?</legend>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn-outline px-4 py-2"
              onClick={() => form.setValue("qty", Math.max(1, qty - 1))}
              aria-label="Decrease quantity"
              disabled={qty <= 1}
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={availability.available}
              {...form.register("qty", { valueAsNumber: true })}
              className="w-20 rounded-xl border border-slate-300 px-4 py-2.5 text-center text-lg font-semibold shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              type="button"
              className="btn-outline px-4 py-2"
              onClick={() => form.setValue("qty", Math.min(maxSelectable, qty + 1))}
              aria-label="Increase quantity"
              disabled={qty >= availability.available}
            >
              +
            </button>
          </div>
          <p className="text-xs text-slate-500">
            {availability.available} spots remaining. Limit {maxSelectable} per order.
          </p>
          {form.formState.errors.qty && (
            <p className="text-xs text-red-600">{form.formState.errors.qty.message}</p>
          )}
        </fieldset>

        {event.addons.length > 0 && (
          <fieldset className="space-y-4" disabled={soldOut || isPending || !event.addons.length}>
            <legend className="text-sm font-semibold text-slate-700">Add-ons</legend>
            <div className="space-y-3">
              {event.addons.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border px-4 py-4 text-sm transition ${
                      isChecked ? "border-blue-400 bg-blue-50/70" : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={addon.id}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={isChecked}
                      onChange={(event) => {
                        if (event.target.checked) {
                          form.setValue("addons", [...selectedAddons, addon.id]);
                        } else {
                          form.setValue(
                            "addons",
                            selectedAddons.filter((id) => id !== addon.id),
                          );
                        }
                      }}
                    />
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900">{addon.name}</p>
                      {addon.description && (
                        <p className="text-sm text-slate-600">{addon.description}</p>
                      )}
                      <p className="text-xs font-semibold text-blue-700">
                        +{formatCurrency(addon.price)}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">Contact information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                First name
              </label>
              <input
                id="firstName"
                autoComplete="given-name"
                {...form.register("firstName")}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {form.formState.errors.firstName && (
                <p className="text-xs text-red-600">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                Last name
              </label>
              <input
                id="lastName"
                autoComplete="family-name"
                {...form.register("lastName")}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {form.formState.errors.lastName && (
                <p className="text-xs text-red-600">{form.formState.errors.lastName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...form.register("email")}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Phone (for SMS updates)
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                {...form.register("phone")}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {form.formState.errors.phone && (
                <p className="text-xs text-red-600">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="licensePlate" className="text-sm font-medium text-slate-700">
              License plate (optional)
            </label>
            <input
              id="licensePlate"
              {...form.register("licensePlate")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm uppercase shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <p className="text-xs text-slate-500">
              Helpful for check-in and if you arrive separately from the driver.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-sm font-medium text-slate-700">
              Special instructions (optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              {...form.register("notes")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="Let us know about oversized vehicles, tailgate setups, or arrival timing."
            />
            {form.formState.errors.notes && (
              <p className="text-xs text-red-600">{form.formState.errors.notes.message}</p>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Promo code</span>
            <button
              type="button"
              className="text-sm font-semibold text-blue-600 underline-offset-4 hover:underline"
              onClick={() => setShowPromoBox((prev) => !prev)}
            >
              {showPromoBox ? "Remove" : "Add"} code
            </button>
          </div>
          {showPromoBox && (
            <input
              type="text"
              {...form.register("promoCode")}
              placeholder="Enter code"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm uppercase shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          )}
        </section>

        <section className="space-y-3 rounded-2xl bg-slate-900 px-5 py-6 text-sm text-white">
          <div className="flex items-center justify-between text-slate-200">
            <span>Spots x {qty}</span>
            <span>{pricing ? formatCurrency(pricing.unitPrice * qty) : '—'}</span>
          </div>
          {selectedAddons.length > 0 && (
            <div className="flex items-center justify-between text-slate-200">
              <span>Add-ons</span>
              <span>
                {formatCurrency(
                  selectedAddons.reduce((sum, addonId) => {
                    const addon = event.addons.find((item) => item.id === addonId);
                    return addon ? sum + addon.price : sum;
                  }, 0),
                )}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-slate-200">
            <span>Service fee ({(event.serviceFeePct * 100).toFixed(0)}%)</span>
            <span>{pricing ? formatCurrency(pricing.serviceFee) : '—'}</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span>Estimated tax ({(event.taxPct * 100).toFixed(1)}%)</span>
            <span>{pricing ? formatCurrency(pricing.tax) : '—'}</span>
          </div>
          <div className="h-px bg-slate-700/60" role="presentation" />
          <div className="flex items-center justify-between text-base font-semibold text-white">
            <span>Total due today</span>
            <span>{pricing ? formatCurrency(pricing.total) : '—'}</span>
          </div>
          <p className="text-xs text-slate-400">
            You’ll be redirected to secure Stripe Checkout (card, Apple Pay, Google Pay). A receipt
            is sent instantly.
          </p>
          <p className="text-xs text-slate-400">
            Promo codes are validated before checkout—any eligible discount is reflected on the Stripe
            payment screen.
          </p>
        </section>

        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <button type="submit" className="btn w-full" disabled={soldOut || isPending}>
          {soldOut ? "Sold out" : isPending ? "Preparing checkout..." : "Reserve & pay"}
        </button>
        <p className="text-xs text-slate-500">
          By reserving you agree to our neighborhood courtesy policy and liability waiver. Unauthorized
          vehicles will be towed at owner’s expense.
        </p>
      </form>
    </div>
  );
}

