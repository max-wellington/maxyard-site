import Link from 'next/link';
import { getUpcomingEvents, getSiteSetting } from '@/lib/data/events';
import { formatDate, formatTime } from '@/lib/datetime';
import { formatCurrency } from '@/lib/pricing';

const trustPoints = [
  { title: 'Private yard parking', copy: 'Reserved spaces on a well-lit residential lot.' },
  { title: 'QR check-in', copy: 'Skip the clipboard—show your QR and roll in.' },
  { title: 'Refund friendly', copy: 'Full refund until the cutoff before kickoff.' },
];

export default async function Home() {
  const [events, settings] = await Promise.all([getUpcomingEvents(), getSiteSetting()]);

  return (
    <>
      <section className="bg-gradient-to-b from-blue-100/60 via-white to-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-16 pt-20 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase text-blue-700">
              ~8 minute walk • Tampa, FL
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Game-day parking, a short walk from the stadium.
            </h1>
            <p className="text-lg text-slate-600">
              Reserve a private yard spot ~8 minutes from Raymond James. Easy in, easy out, QR
              check-in, and friendly on-site staff to guide you to your space.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/events" className="btn">
                Find an event
              </Link>
              <Link href="/info" className="btn-outline">
                Know before you park
              </Link>
            </div>
          </div>
          <div className="relative flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-blue-200/60">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Why Yard Parking?
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    8′
                  </span>
                  <span>Walk to the gates in minutes—no waiting on shuttles or traffic lights.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    QR
                  </span>
                  <span>Digital check-in keeps the line moving. Show your code and roll in.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    ⇄
                  </span>
                  <span>Easy exit plan so you can head home without getting boxed in.</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-700">
              <p className="font-semibold">Approximate location</p>
              <p>West Tampa neighborhood • Independent lot • Exact address sent after purchase</p>
              <p className="mt-2 text-xs">
                Distance is calculated by foot—plan for about 8 minutes at a casual pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900">Upcoming events</h2>
              <p className="mt-2 max-w-xl text-slate-600">
                Pick your game, concert, or bowl and secure your spot before the day-of rush.
              </p>
            </div>
            <Link href="/events" className="btn-outline w-fit">
              View all events
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {events.length === 0 && (
              <div className="card md:col-span-3">
                <p className="text-sm font-semibold text-slate-800">No events posted yet</p>
                <p className="mt-2 text-sm text-slate-600">
                  Check back soon or join the mailing list to be notified when the next slate of
                  events goes live.
                </p>
              </div>
            )}
            {events.slice(0, 3).map((event) => {
              const paidQty = event.orders.reduce((acc, order) => acc + order.qty, 0);
              const remaining = Math.max(0, event.capacity - paidQty);
              const lowestPrice = event.priceTiers.length
                ? Math.min(event.basePrice, ...event.priceTiers.map((tier) => tier.price))
                : event.basePrice;
              return (
                <article key={event.id} className="card flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{formatDate(event.dateTime, settings?.timezone ?? undefined)}</span>
                    <span>{formatTime(event.dateTime, settings?.timezone ?? undefined)}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{event.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3">{event.description}</p>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                    <span>{remaining > 0 ? `${remaining} spots left` : 'Sold out'}</span>
                    <span>From {formatCurrency(lowestPrice)}</span>
                  </div>
                  <Link href={`/events/${event.slug}`} className="btn w-full text-center">
                    View & reserve
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-[2fr,3fr] md:items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">Know before you park</h2>
              <p className="text-slate-200">
                We keep the experience stress-free. Read through the playbook so everyone in your
                car knows what to expect once you arrive on-site.
              </p>
              <Link href="/info" className="btn bg-white text-slate-900 hover:bg-slate-100">
                House rules & arrival tips
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {trustPoints.map((point) => (
                <div key={point.title} className="rounded-3xl bg-slate-800/50 p-6 shadow-lg">
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
                    {point.title}
                  </p>
                  <p className="mt-3 text-sm text-slate-100">{point.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
          <div className="space-y-5">
            <h2 className="text-3xl font-semibold text-slate-900">Where you’ll park</h2>
            <p className="text-slate-600">
              We’re in a residential pocket west of the stadium. The exact address unlocks once you
              book, along with turn-by-turn instructions, gate code (if applicable), and the on-site
              contact number.
            </p>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>• 8-minute walk to Raymond James Stadium</li>
              <li>• Tailgate-friendly options available on select events</li>
              <li>• Refunds until {settings?.timezone ? 'the posted cutoff' : 'the event cutoff window'}</li>
            </ul>
          </div>
          <div className="card h-full overflow-hidden p-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <iframe
                title="Approximate location map"
                aria-label="Approximate map location for yard parking"
                loading="lazy"
                className="h-full w-full border-0"
                src={
                  settings?.mapEmbedUrl ??
                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.372640989237!2d-82.50610502382163!3d27.976212169133447'
                }
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="space-y-2 border-t border-slate-200 p-6 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Raymond James Stadium • Tampa, FL</p>
              <p className="text-slate-500">
                Exact street address is shared on the confirmation page and email after purchase to
                keep our block private and respectful.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
