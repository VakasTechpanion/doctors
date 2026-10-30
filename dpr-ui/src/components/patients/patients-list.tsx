'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiListClinicPatients, ClinicPatient } from '@/lib/api';
import { useSession } from '@/lib/session';

export function PatientsList() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<ClinicPatient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.accessToken || (session.role !== 'DOCTOR' && session.role !== 'CLINIC_OWNER')) {
      router.replace('/login?next=/doctor/patients');
      return;
    }

    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const data = await apiListClinicPatients(session.accessToken!, q);
        if (!cancelled) setRows(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load patients');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [session, sessionLoading, q, router]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-teal-700">Clinical records</p>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="mt-1 text-sm text-slate-500">
            MRN-based registry with demographics, allergies, and documents.
          </p>
        </div>
        <Link
          href="/doctor/patients/new"
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          + Add patient
        </Link>
      </div>

      <div className="mt-6">
        <input
          value={q}
          onChange={(e) => {
            setLoading(true);
            setQ(e.target.value);
          }}
          placeholder="Search by name, phone, MRN, or email"
          className="w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
        />
      </div>

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

      {loading ? (
        <p className="mt-8 text-slate-500">Loading patients…</p>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          No patients yet.{' '}
          <Link href="/doctor/patients/new" className="font-medium text-teal-700 hover:underline">
            Register your first patient
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">MRN</th>
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Blood</th>
                <th className="px-4 py-3 font-medium">Allergies</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{p.mrn}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{p.email || '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.phone || '—'}</td>
                  <td className="px-4 py-3">{p.bloodGroup || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {p.allergies?.length ? p.allergies.join(', ') : 'NKDA'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/doctor/patients/${p.id}`}
                      className="font-medium text-teal-700 hover:underline"
                    >
                      Open chart
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
