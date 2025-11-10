export const metadata = {
  title: "Contact • Bayside Yard Parking",
  description: "Reach the Bayside Yard Parking hosts to reserve your minimalist spot.",
};

export default function ContactPage() {
  return (
    <section className="container py-16 md:py-20">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">Let’s hold your spot</h1>
        <p className="text-sm text-slate-600">
          Share your event, arrival window, and vehicle details. We confirm availability quickly
          between 8 AM and 8 PM ET.
        </p>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Text</p>
            <a href="sms:+18135550123" className="text-lg font-semibold text-slate-900">
              813-555-0123
            </a>
            <p className="text-xs text-slate-500">Fastest response on event days.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Call</p>
            <a href="tel:+18135550123" className="text-lg font-semibold text-slate-900">
              (813) 555-0123
            </a>
            <p className="text-xs text-slate-500">Leave a voicemail after hours—we’ll text back.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Email</p>
            <a
              href="mailto:hello@baysideparking.com"
              className="text-lg font-semibold text-slate-900"
            >
              hello@baysideparking.com
            </a>
            <p className="text-xs text-slate-500">
              Include event name, vehicle make, and how many people you’re bringing.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Quick answers</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Payment due on arrival (cash, card, or digital wallet).</li>
            <li>• Spot holds require arrival within the stated window.</li>
            <li>• Need to cancel? Let us know 4 hours before the event for a free release.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

