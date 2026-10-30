'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { PatientForm } from '@/components/patients/patient-form';
import { apiGetClinicPatient, apiUpdateClinicPatient, ClinicPatient } from '@/lib/api';
import { useSession } from '@/lib/session';

export default function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const [patient, setPatient] = useState<ClinicPatient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.accessToken) {
      router.replace(`/login?next=/doctor/patients/${id}/edit`);
      return;
    }
    (async () => {
      try {
        const chart = await apiGetClinicPatient(session.accessToken!, id);
        setPatient(chart.patient);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      }
    })();
  }, [session, sessionLoading, id, router]);

  if (error) {
    return <p className="p-10 text-red-700">{error}</p>;
  }
  if (!patient) {
    return <p className="p-10 text-slate-500">Loading patient…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={`/doctor/patients/${id}`}
        className="text-sm font-medium text-teal-700 hover:underline"
      >
        ← Back to chart
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        Edit {patient.firstName} {patient.lastName}
      </h1>
      <p className="mt-1 font-mono text-sm text-slate-500">{patient.mrn}</p>
      <div className="mt-8">
        <PatientForm
          initial={patient}
          submitLabel="Update patient"
          onSubmit={async (data) => {
            await apiUpdateClinicPatient(session!.accessToken!, id, data);
            router.push(`/doctor/patients/${id}`);
          }}
        />
      </div>
    </div>
  );
}
