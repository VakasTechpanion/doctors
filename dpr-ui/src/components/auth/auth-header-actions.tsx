'use client';

import Link from 'next/link';
import { clearDemoSession, dashboardPathForRole } from '@/lib/demo-auth';
import { notifySessionChanged, useSession } from '@/lib/session';

export function AuthHeaderActions() {
  const { session, loading } = useSession();

  if (loading) {
    return <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-200" />;
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href={dashboardPathForRole(session.role)}
          className="hidden rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:inline-flex"
        >
          {session.firstName}
        </Link>
        <button
          type="button"
          onClick={() => {
            clearDemoSession();
            notifySessionChanged();
            window.location.href = '/';
          }}
          className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800"
      >
        Sign up
      </Link>
    </div>
  );
}
