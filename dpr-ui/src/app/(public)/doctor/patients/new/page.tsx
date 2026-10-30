'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PatientForm } from '@/components/patients/patient-form';
import { apiCreateClinicPatient } from '@/lib/api';
import { useSession } from '@/lib/session';

export default function NewPatientPage() {
  const router = useRouter();
  const { session, loading } = useSession();

  if (loading) return <p className="p-10 text-slate-500">Loading…</p>;
  if (!session?.accessToken) {
    router.replace('/login?next=/doctor/patients/new');
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/doctor/patients" className="text-sm font-medium text-teal-700 hover:underline">
        ← Patients
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Add patient</h1>
      <p className="mt-1 text-sm text-slate-600">
        Creates a clinic chart with an auto-generated Medical Record Number (MRN).
      </p>
      <div className="mt-8">
        <PatientForm
          submitLabel="Save patient"
          onSubmit={async (data) => {
            const created = await apiCreateClinicPatient(session.accessToken!, data);
            router.push(`/doctor/patients/${created.id}`);
          }}
        />
      </div>
    </div>
  );
}
