'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiPatientDashboard, PatientDashboard } from '@/lib/api';
import { dashboardPathForRole } from '@/lib/demo-auth';
import { formatInr, formatWhen } from '@/lib/format';
import { useSession } from '@/lib/session';

export function PatientDashboardView() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const [data, setData] = useState<PatientDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.accessToken) {
      router.replace('/login?next=/patient');
      return;
    }
    if (session.role !== 'PATIENT') {
      router.replace(dashboardPathForRole(session.role));
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const dash = await apiPatientDashboard(session.accessToken!);
        if (!cancelled) setData(dash);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session, sessionLoading, router]);

  if (sessionLoading || loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-slate-600">Loading your patient dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-red-700">{error}</p>
        <Link href="/login" className="mt-4 inline-block text-teal-700 hover:underline">
          Sign in again
        </Link>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-teal-700">Patient dashboard</p>
          <h1 className="text-2xl font-bold text-slate-900">
            Hello, {data.patient.firstName} {data.patient.lastName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{data.patient.email}</p>
        </div>
        <Link
          href="/doctors"
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          Book new visit
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Upcoming appointments</h2>
        {data.upcomingAppointments.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            No upcoming appointments.{' '}
            <Link href="/doctors" className="font-medium text-teal-700 hover:underline">
              Find a doctor
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {data.upcomingAppointments.map((apt) => (
              <article
                key={apt.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="font-semibold text-slate-900">{apt.doctorName}</p>
                <p className="text-sm text-teal-800">{apt.specialty}</p>
                <p className="mt-2 text-sm text-slate-600">{formatWhen(apt.when)}</p>
                <p className="text-sm text-slate-500">{apt.clinic}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs">{apt.type}</span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
                    {apt.status}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs">
                    {formatInr(apt.feeInr)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6">
        <Link
          href="/patient/payments"
          className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-teal-800 shadow-sm hover:bg-slate-50"
        >
          Payment history & receipts →
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Recent visits</h2>
        {data.recentVisits.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Completed visits will show here.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {data.recentVisits.map((v) => (
              <li key={v.id} className="flex items-center justify-between px-5 py-4 text-sm">
                <div>
                  <p className="font-medium text-slate-900">{v.doctorName}</p>
                  <p className="text-slate-500">{formatWhen(v.when)}</p>
                </div>
                <span className="text-slate-700">{formatInr(v.feeInr)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
