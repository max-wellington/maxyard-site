import Link from "next/link";
import { events } from "@/data/events";

export const metadata = {
  title: "Events • Bayside Yard Parking",
  description: "Simple list of upcoming games and shows at Bayside Yard Parking.",
};

export default function EventsPage() {
  return (
    <section className="container py-16 md:py-20">
      <header className="mb-10 space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Reserve by event</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          We host one driveway, one yard, and one friendly team. Choose the gathering you are heading
          to and reach out. Payment happens on arrival—cash, card, or tap.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {events.map((event) => (
          <article key={event.id} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              <span>{event.date}</span>
              <span>{event.availability}</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">{event.title}</h2>
            <p className="text-sm text-slate-500">
              {event.time} · {event.price}
            </p>
            <p className="text-sm text-slate-600">{event.details}</p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:+18135550123" className="btn">
                Call to book
              </a>
              <Link href="/contact" className="btn border-slate-300 text-slate-600 hover:border-slate-900">
                Send details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

