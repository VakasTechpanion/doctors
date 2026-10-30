'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiListDoctors, DirectoryDoctor } from '@/lib/api';
import { useSession } from '@/lib/session';

export function LiveDoctorsDirectory() {
  const { session } = useSession();
  const [doctors, setDoctors] = useState<DirectoryDoctor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setDoctors(await apiListDoctors());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load doctors');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading registered doctors…</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        {error}. Start the API and check MongoDB connection.
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
        No doctors registered yet. Sign up as a doctor to appear here.
      </div>
    );
  }

  const isDoctor =
    session?.role === 'DOCTOR' || session?.role === 'CLINIC_OWNER';

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {doctors.map((d) => {
        const isSelf = session?.userId === d.id;
        return (
          <article
            key={d.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg font-semibold text-teal-800">
                {d.firstName[0]}
                {d.lastName[0]}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Dr. {d.firstName} {d.lastName}
                  {isSelf ? (
                    <span className="ml-2 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-800">
                      You
                    </span>
                  ) : null}
                </h3>
                <p className="text-sm text-teal-800">Registered on MediConnect</p>
                <p className="text-sm text-slate-500">{d.email}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {isDoctor ? (
                isSelf ? (
                  <Link
                    href="/doctor/patients"
                    className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
                  >
                    Manage patients
                  </Link>
                ) : (
                  <span className="text-xs text-slate-400">Colleague</span>
                )
              ) : session?.role === 'PATIENT' ? (
                <Link
                  href={`/checkout/appointment/${d.id}?type=clinic&live=1&name=${encodeURIComponent(`Dr. ${d.firstName} ${d.lastName}`)}`}
                  className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
                >
                  Book & pay
                </Link>
              ) : (
                <Link
                  href="/login?next=/doctors"
                  className="rounded-lg border border-teal-700 px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-50"
                >
                  Sign in to book
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
