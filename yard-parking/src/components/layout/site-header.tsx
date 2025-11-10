import Link from 'next/link';
import { clsx } from 'clsx';

const navItems = [
  { href: '/events', label: 'Events' },
  { href: '/info', label: 'Know Before You Park' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
              YP
            </span>
            Yard Parking
          </Link>
          <span className="hidden text-sm text-slate-500 md:inline">
            ~8 minute walk to Raymond James Stadium
          </span>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Admin
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/events"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Events
          </Link>
        </div>
      </div>
    </header>
  );
}

