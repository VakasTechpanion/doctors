'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  apiDoctorDashboard,
  apiUpdateAppointmentStatus,
  DoctorDashboard,
} from '@/lib/api';
import { dashboardPathForRole } from '@/lib/demo-auth';
import { formatInr } from '@/lib/format';
import { useSession } from '@/lib/session';

export function DoctorDashboardView() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const [data, setData] = useState<DoctorDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.accessToken) {
      router.replace('/login?next=/doctor');
      return;
    }
    if (session.role !== 'DOCTOR' && session.role !== 'CLINIC_OWNER') {
      router.replace(dashboardPathForRole(session.role));
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const dash = await apiDoctorDashboard(session.accessToken!);
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

  async function markCompleted(id: string) {
    if (!session?.accessToken) return;
    await apiUpdateAppointmentStatus(session.accessToken, id, 'COMPLETED');
    const dash = await apiDoctorDashboard(session.accessToken);
    setData(dash);
  }

  if (sessionLoading || loading) {
    return <DashboardSkeleton title="Loading your doctor dashboard…" />;
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

  const name = `Dr. ${data.doctor.firstName} ${data.doctor.lastName}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-teal-700">Doctor dashboard</p>
          <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
          <p className="mt-1 text-sm text-slate-500">{data.doctor.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/doctor/patients"
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
          >
            Patients & records
          </Link>
          <Link
            href="/doctor/patients/new"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            + Add patient
          </Link>
          <Link
            href="/doctor/billing"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Billing
          </Link>
        </div>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Today's appointments" value={String(data.stats.todayCount)} />
        <StatCard
          label="Completed"
          value={String(data.stats.completed)}
          valueClass="text-emerald-700"
        />
        <StatCard label="Revenue today" value={formatInr(data.stats.revenueTodayInr)} />
      </dl>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Today&apos;s schedule</h2>
        {data.schedule.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            No appointments scheduled for today yet. When patients book you, they will appear here.
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.schedule.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.time}</td>
                    <td className="px-4 py-3">{row.patient}</td>
                    <td className="px-4 py-3 text-slate-600">{row.type}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs">{row.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {row.status !== 'Completed' ? (
                        <button
                          type="button"
                          onClick={() => markCompleted(row.id)}
                          className="text-xs font-medium text-teal-700 hover:underline"
                        >
                          Mark completed
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className={`mt-1 text-3xl font-bold text-slate-900 ${valueClass ?? ''}`}>{value}</dd>
    </div>
  );
}

function DashboardSkeleton({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-slate-600">{title}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200/70" />
        ))}
      </div>
    </div>
  );
}
