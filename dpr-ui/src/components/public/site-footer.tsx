import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="font-semibold text-teal-900">MediConnect</p>
          <p className="mt-2 text-sm text-slate-600">
            Appointments, records, and clinic operations for India.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Product</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>
              <Link href="/doctors" className="hover:text-teal-700">
                Find doctors
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-teal-700">
                Pricing
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Legal</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>Privacy policy (placeholder)</li>
            <li>Terms of service (placeholder)</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Contact</p>
          <p className="mt-2 text-sm text-slate-600">support@mediconnect.demo</p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} MediConnect · Demo UI · Not for clinical use
      </div>
    </footer>
  );
}
