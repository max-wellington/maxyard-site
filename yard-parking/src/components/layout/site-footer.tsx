import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Yard Parking</p>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Private residential yard parking ~8 minutes from Raymond James Stadium. Secure your spot,
            skip the gridlock, and enjoy the game.
          </p>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p>
            Contact:{' '}
            <Link href="mailto:host@yardparking.com" className="text-blue-600 hover:underline">
              host@yardparking.com
            </Link>{' '}
            •{' '}
            <Link href="tel:+18135550123" className="text-blue-600 hover:underline">
              (813) 555-0123
            </Link>
          </p>
          <p className="max-w-sm">
            Independent private parking—Not affiliated with Raymond James Stadium or event
            organizers.
          </p>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Yard Parking. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

