export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>Bayside Yard Parking • Tampa, FL</p>
        <div className="space-x-4">
          <a href="tel:+18135550123" className="hover:text-slate-900">
            (813) 555-0123
          </a>
          <a href="mailto:hello@baysideparking.com" className="hover:text-slate-900">
            hello@baysideparking.com
          </a>
        </div>
        <p className="text-xs text-slate-400">
          Independent parking near Raymond James Stadium. Not affiliated with the venue.
        </p>
      </div>
    </footer>
  );
}

