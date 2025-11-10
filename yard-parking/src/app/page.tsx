import Link from "next/link";
import { events } from "@/data/events";

const highlights = [
  "Six-minute walk to Gate C at Raymond James Stadium",
  "Private yard with numbered gravel spots",
  "Text confirmation morning-of and on-site steward",
];

export default function Home() {
  return (
    <>
      <section className="container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr,1fr] md:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Simple game day parking
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
              Minimal effort. Easy exit. Yard parking that just works.
            </h1>
            <p className="text-base text-slate-600">
              Reserve a quiet residential spot, stroll to the stadium, and beat the gridlock on the
              way home. Bayside Yard Parking is locally hosted and intentionally small—twelve
              vehicles max per event.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/events" className="btn">
                View upcoming events
              </Link>
              <Link href="#reserve" className="btn border-slate-300 text-slate-600 hover:border-slate-900">
                How it works
              </Link>
            </div>
          </div>
          <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Why guests reserve</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              {highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-900" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              <p className="font-semibold text-slate-700">Location</p>
              <p>West Tampa neighborhood. Exact address shared after booking to protect our block.</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="reserve" className="border-y border-slate-200 bg-white py-16 md:py-20">
        <div className="container space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Reserve in three beats</h2>
            <p className="text-sm text-slate-600">
              Same straightforward flow for every event. No apps, no complicated dashboards.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Pick your event",
                description: "Browse upcoming games and shows. Each listing shows price, arrival window, and space count.",
              },
              {
                title: "Lock your spot",
                description: "Send a quick text or call with your name, vehicle make, and party size. We confirm instantly.",
              },
              {
                title: "Scan and park",
                description: "Show your confirmation at the curb, follow the cones, and settle in. You are back on the road within minutes after the event.",
              },
            ].map((step, index) => (
              <div key={step.title} className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Step {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Upcoming events</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              First come, first served. We open gates 2 hours before kickoff or showtime.
            </p>
          </div>
          <Link href="/events" className="btn border-slate-300 text-slate-600 hover:border-slate-900">
            All events
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {events.slice(0, 3).map((event) => (
            <article key={event.id} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{event.date}</p>
              <h3 className="text-xl font-semibold text-slate-900">{event.title}</h3>
              <p className="text-sm text-slate-500">
                {event.time} · {event.price} · {event.availability}
              </p>
              <p className="text-sm text-slate-600">{event.details}</p>
              <Link href="/contact" className="btn border-slate-300 text-slate-600 hover:border-slate-900">
                Hold my spot
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container grid gap-10 md:grid-cols-[1fr,1fr] md:items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Hosting a minimalist lot</h2>
            <p className="text-sm text-slate-600">
              Bayside Yard Parking is purposefully calm: string lights, chalked numbers, and enough space
              to open every door. We limit tailgating to low-key setups so neighbors stay happy and exit
              lanes stay clear.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Quiet hours begin 30 minutes after the event ends</li>
              <li>• No generators, deep fryers, or oversized speakers</li>
              <li>• Respect the block—no trash left behind</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Need a sure spot?</p>
            <p className="mt-4 text-lg font-semibold">
              Text <a href="sms:+18135550123" className="underline">813-555-0123</a> with your name, event, and vehicle. We will confirm
              within minutes during daylight hours.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
