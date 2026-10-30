'use client';

import Link from 'next/link';
import { AuthHeaderActions } from '@/components/auth/auth-header-actions';
import { dashboardPathForRole } from '@/lib/demo-auth';
import { useSession } from '@/lib/session';

export function SiteHeader() {
  const { session } = useSession();

  const links = session
    ? [
        { href: '/doctors', label: 'Find doctors' },
        { href: dashboardPathForRole(session.role), label: 'Dashboard' },
        ...(session.role === 'DOCTOR' || session.role === 'CLINIC_OWNER'
          ? [
              { href: '/doctor/patients', label: 'Patients' },
              { href: '/doctor/billing', label: 'Billing' },
            ]
          : [{ href: '/patient/payments', label: 'Payments' }]),
        { href: '/pricing', label: 'Pricing' },
      ]
    : [
        { href: '/doctors', label: 'Find doctors' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/signup', label: 'Get started' },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-sm font-bold text-white">
            M
          </span>
          <span className="text-lg font-semibold tracking-tight text-teal-900">MediConnect</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href} className="transition hover:text-teal-800">
              {l.label}
            </Link>
          ))}
        </nav>
        <AuthHeaderActions />
      </div>
    </header>
  );
}
