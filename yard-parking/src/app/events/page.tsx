import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DateTime } from 'luxon';
import { getUpcomingEvents, getSiteSetting } from '@/lib/data/events';
import { formatCurrency } from '@/lib/pricing';
import { formatDate, formatTime } from '@/lib/datetime';

interface EventsPageProps {
  searchParams?: Promise<{
    q?: string;
    month?: string;
  }>;
}

export default async function EventsPage(props: EventsPageProps) {
  const searchParams = (await props.searchParams) ?? {};
  const [events, settings] = await Promise.all([getUpcomingEvents({ includeSoldOut: true }), getSiteSetting()]);

  if (!events) {
    notFound();
  }

  const timezone = settings?.timezone ?? 'America/New_York';
  const months = Array.from(
    new Set(
      events.map((event) =>
        DateTime.fromJSDate(event.dateTime).setZone(timezone).toFormat('yyyy-MM'),
      ),
    ),
  ).sort();

  const filteredEvents = events.filter((event) => {
    const monthKey = DateTime.fromJSDate(event.dateTime).setZone(timezone).toFormat('yyyy-MM');
    const matchesMonth = searchParams.month ? monthKey === searchParams.month : true;
    const searchText = `${event.title} ${event.description ?? ''}`.toLowerCase();
    const matchesQuery = searchParams.q
      ? searchText.includes(searchParams.q.toLowerCase())
      : true;
    return matchesMonth && matchesQuery;
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12 space-y-4">
        <p className="badge w-fit">Reserve ahead</p>
        <h1 className="text-4xl font-semibold text-slate-900">Browse events</h1>
        <p className="max-w-2xl text-slate-600">
          Pick your event and reserve the number of parking spots you need. We show live capacity,
          tiered pricing, and addons like tailgate passes or oversized vehicle access.
        </p>
      </div>

      <form className="mb-10 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 md:grid-cols-3">
        <div className="md:col-span-2">
          <label htmlFor="q" className="text-sm font-semibold text-slate-700">
            Search by team, artist, or event
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={searchParams.q ?? ''}
            placeholder="e.g. Buccaneers, concert, bowl"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
        <div>
          <label htmlFor="month" className="text-sm font-semibold text-slate-700">
            Filter by month
          </label>
          <select
            id="month"
            name="month"
            defaultValue={searchParams.month ?? ''}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="">All months</option>
            {months.map((month) => {
              const dt = DateTime.fromFormat(month, 'yyyy-MM', { zone: timezone });
              return (
                <option key={month} value={month}>
                  {dt.toFormat('LLLL yyyy')}
                </option>
              );
            })}
          </select>
        </div>
        <div className="md:col-span-3 flex flex-wrap items-center gap-2">
          <button type="submit" className="btn">
            Apply filters
          </button>
          <Link href="/events" className="btn-outline">
            Reset
          </Link>
        </div>
      </form>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredEvents.length === 0 && (
          <div className="card">
            <p className="text-sm font-semibold text-slate-800">No events match your filters</p>
            <p className="mt-2 text-sm text-slate-600">
              Try clearing your search or selecting a different month. New events are added often,
              especially leading up to home games and tour announcements.
            </p>
          </div>
        )}
        {filteredEvents.map((event) => {
          const paidQty = event.orders.reduce((acc, order) => acc + order.qty, 0);
          const remaining = Math.max(0, event.capacity - paidQty);
          const soldOut = remaining === 0;
          const priceOptions = event.priceTiers.map((tier) => tier.price);
          const fromPrice = formatCurrency(Math.min(event.basePrice, ...priceOptions, event.basePrice));
          const gatesOpen =
            event.gatesOpenAt &&
            formatTime(event.gatesOpenAt, settings?.timezone ?? 'America/New_York');
          return (
            <article key={event.id} className="card flex flex-col gap-5">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>{formatDate(event.dateTime, timezone)}</span>
                <span aria-hidden>•</span>
                <span>{formatTime(event.dateTime, timezone)}</span>
                {gatesOpen && (
                  <>
                    <span aria-hidden>•</span>
                    <span>Gates {gatesOpen}</span>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900">{event.title}</h2>
                <p className="text-sm text-slate-600">{event.description}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                <span>{soldOut ? 'Sold out' : `${remaining} spots left`}</span>
                <span>From {fromPrice}</span>
              </div>
              <Link
                href={`/events/${event.slug}`}
                className={`btn w-full ${soldOut ? 'pointer-events-none opacity-60' : ''}`}
                aria-disabled={soldOut}
              >
                {soldOut ? 'Join waitlist soon' : 'View & reserve'}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

