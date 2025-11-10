import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DateTime } from 'luxon';
import { getEventBySlug, getEventAvailability, getSiteSetting } from '@/lib/data/events';
import { formatCurrency, getRefundCutoff } from '@/lib/pricing';
import { DEFAULT_TIMEZONE, formatDate, formatTime } from '@/lib/datetime';
import { BookingForm } from '@/components/events/booking-form';

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const [event, setting] = await Promise.all([getEventBySlug(slug), getSiteSetting()]);

  if (!event) {
    notFound();
  }

  const availability = await getEventAvailability(event.id);
  const timezone = setting?.timezone ?? DEFAULT_TIMEZONE;
  const refundCutoff = getRefundCutoff(event, setting);

  const nextTier = event.priceTiers
    .filter((tier) => tier.startsAt && DateTime.fromJSDate(tier.startsAt).setZone(timezone) > DateTime.now().setZone(timezone))
    .sort(
      (a, b) =>
        DateTime.fromJSDate(a.startsAt!).toMillis() - DateTime.fromJSDate(b.startsAt!).toMillis(),
    )[0];

  return (
    <div className="bg-gradient-to-b from-blue-50/50 via-white to-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[2fr,1.2fr]">
          <article className="space-y-10">
            <header className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-blue-100/50">
              <div className="flex flex-wrap items-center gap-3 text-sm text-blue-700">
                <span className="badge bg-blue-100 text-blue-700">
                  {availability.available > 0 ? `${availability.available} spots left` : 'Sold out'}
                </span>
                <span className="badge bg-slate-100 text-slate-700">~8 minute walk</span>
                <span className="badge bg-slate-100 text-slate-700">
                  Refunds until {event.cutoffHours}h before
                </span>
              </div>
              <h1 className="text-4xl font-semibold text-slate-900">{event.title}</h1>
              <p className="max-w-2xl text-slate-600">{event.description}</p>
              <dl className="grid gap-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 md:grid-cols-3">
                <div>
                  <dt className="font-semibold text-slate-900">Date</dt>
                  <dd>{formatDate(event.dateTime, timezone)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Kickoff / Start</dt>
                  <dd>{formatTime(event.dateTime, timezone)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Gates open</dt>
                  <dd>
                    {event.gatesOpenAt
                      ? formatTime(event.gatesOpenAt, timezone)
                      : '90 min before'}
                  </dd>
                </div>
              </dl>
            </header>

            <section className="card space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">What to expect</h2>
                <p className="mt-2 text-sm text-slate-600">
                  We keep arrivals flowing smoothly. Please review the game plan so you’re ready to
                  park and enjoy the event.
                </p>
              </div>
              <ul className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    title: 'Arrival window',
                    body:
                      event.gatesOpenAt
                        ? `Pull in between ${formatTime(event.gatesOpenAt, timezone)} and the posted kickoff.`
                        : 'Arrive within your 90-minute arrival window before kickoff.',
                  },
                  {
                    title: 'Check-in',
                    body:
                      'Keep your QR handy. Show it to our attendant at the curb and follow their direction to your spot.',
                  },
                  {
                    title: 'Tailgating',
                    body:
                      'Tailgating is welcome in marked areas. No glass, flames above waist height, or speakers after kickoff.',
                  },
                  {
                    title: 'Departure',
                    body:
                      'After the event, exit in the order directed. Please watch for pedestrians and respect the neighborhood.',
                  },
                ].map((item) => (
                  <li key={item.title} className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{item.body}</p>
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">Cancellation & refunds</p>
                <p className="mt-2">
                  Full refund until{' '}
                  <span className="font-semibold">
                    {refundCutoff.setZone(timezone).toFormat('MMM d, h:mm a')}
                  </span>
                  . After that, sales are final unless the event is postponed or canceled. Need help?
                  Reply to your confirmation email or text us.
                </p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-5 text-sm text-blue-700">
                <p className="font-semibold text-blue-900">Tailgating notes</p>
                <p className="mt-2">
                  Bring chairs, coolers, and small grills. Please no glass, deep fryers, or loud
                  PA speakers. Leave the space tidy so every guest enjoys the same welcoming
                  experience.
                </p>
              </div>
            </section>

            <section className="card space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900">Need anything else?</h2>
              <p className="text-sm text-slate-600">
                Reach out and we’ll help you plan early arrival, group caravans, or bus parking.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-blue-700">
                <Link href="mailto:host@yardparking.com" className="btn-outline">
                  Email the host
                </Link>
                <Link href="/contact" className="btn-outline">
                  Contact form
                </Link>
              </div>
            </section>
          </article>

          <aside className="space-y-6">
            <BookingForm
              event={event}
              availability={availability}
              timezone={timezone}
              nextTier={nextTier}
            />
            <div className="card space-y-3 text-sm text-slate-600">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                Parking highlights
              </p>
              <ul className="space-y-2">
                <li>• Private yard lot with attendants on-site</li>
                <li>• QR code confirmation + optional SMS reminders</li>
                <li>• Add tailgate pass or oversized vehicle parking</li>
                <li>• Refunds until {event.cutoffHours} hours before start</li>
              </ul>
            </div>
            <div className="card space-y-3 text-sm text-slate-600">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                Price breakdown
              </p>
              <p>
                Base price from {formatCurrency(event.basePrice)} per vehicle. Service fee{' '}
                {(event.serviceFeePct * 100).toFixed(0)}%, tax {(event.taxPct * 100).toFixed(1)}%.
              </p>
              {nextTier && (
                <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
                  <span className="font-semibold">Heads up:</span> {nextTier.name} pricing kicks in{' '}
                  {DateTime.fromJSDate(nextTier.startsAt!).setZone(timezone).toRelative({ unit: ['hours', 'days'] })}
                  .
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

