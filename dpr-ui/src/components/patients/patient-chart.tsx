'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import {
  apiArchiveClinicPatient,
  apiGetClinicPatient,
  apiUploadPatientDocument,
  PatientChart,
  patientDocumentDownloadUrl,
} from '@/lib/api';
import { useSession } from '@/lib/session';

const CATEGORIES = [
  'PRESCRIPTION',
  'LAB_REPORT',
  'IMAGING',
  'DISCHARGE_SUMMARY',
  'CONSENT',
  'VISIT_SUMMARY',
  'INSURANCE',
  'OTHER',
];

export function PatientChartView({ patientId }: { patientId: string }) {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const [chart, setChart] = useState<PatientChart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('LAB_REPORT');
  const [docDate, setDocDate] = useState('');
  const [docDesc, setDocDesc] = useState('');
  const [file, setFile] = useState<File | null>(null);

  async function reload(token: string) {
    const data = await apiGetClinicPatient(token, patientId);
    setChart(data);
  }

  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.accessToken || (session.role !== 'DOCTOR' && session.role !== 'CLINIC_OWNER')) {
      router.replace('/login?next=/doctor/patients');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await reload(session.accessToken!);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load chart');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session, sessionLoading, patientId, router]);

  async function onUpload(e: FormEvent) {
    e.preventDefault();
    if (!session?.accessToken || !file || !docTitle) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('title', docTitle);
      form.append('category', docCategory);
      if (docDesc) form.append('description', docDesc);
      if (docDate) form.append('documentDate', docDate);
      form.append('file', file);
      await apiUploadPatientDocument(session.accessToken, patientId, form);
      setDocTitle('');
      setDocDesc('');
      setDocDate('');
      setFile(null);
      await reload(session.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function archive() {
    if (!session?.accessToken || !confirm('Archive this patient record?')) return;
    await apiArchiveClinicPatient(session.accessToken, patientId);
    router.push('/doctor/patients');
  }

  async function downloadDoc(id: string, fileName: string) {
    if (!session?.accessToken) return;
    const res = await fetch(patientDocumentDownloadUrl(id), {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    if (!res.ok) {
      setError('Download failed');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading || sessionLoading) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-slate-500">Loading patient chart…</p>;
  }
  if (!chart) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-red-700">{error || 'Patient not found'}</p>
        <Link href="/doctor/patients" className="mt-4 inline-block text-teal-700 hover:underline">
          Back to patients
        </Link>
      </div>
    );
  }

  const p = chart.patient;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/doctor/patients" className="text-sm font-medium text-teal-700 hover:underline">
        ← Patients
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-slate-500">{p.mrn}</p>
          <h1 className="text-2xl font-bold text-slate-900">
            {p.firstName} {p.lastName}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {[p.gender, p.dateOfBirth ? `DOB ${p.dateOfBirth}` : null, p.bloodGroup]
              .filter(Boolean)
              .join(' · ') || 'Demographics incomplete'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/doctor/patients/${p.id}/edit`}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Edit details
          </Link>
          <button
            type="button"
            onClick={archive}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Archive
          </button>
        </div>
      </div>

      {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase text-slate-500">Contact</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Phone" value={p.phone} />
            <Row label="Email" value={p.email} />
            <Row
              label="Address"
              value={[p.addressLine1, p.city, p.state, p.pincode].filter(Boolean).join(', ')}
            />
            <Row
              label="Emergency"
              value={
                p.emergencyName || p.emergencyPhone
                  ? `${p.emergencyName || '—'} (${p.emergencyPhone || '—'})`
                  : undefined
              }
            />
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase text-slate-500">Clinical summary</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-3 text-sm">
            <ChipList title="Allergies" items={p.allergies} empty="NKDA" />
            <ChipList title="Chronic conditions" items={p.chronicConditions} empty="None recorded" />
            <ChipList title="Medications" items={p.currentMedications} empty="None recorded" />
          </div>
          {p.clinicalNotes ? (
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 whitespace-pre-wrap">
              {p.clinicalNotes}
            </div>
          ) : null}
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Clinical documents</h2>
        <p className="mt-1 text-sm text-slate-500">
          Standard categories: prescription, lab, imaging, discharge, consent. Max 10 MB. PDF / image /
          Word.
        </p>

        <form onSubmit={onUpload} className="mt-4 grid gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="font-medium text-slate-700">Title *</span>
            <input
              required
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="CBC report — Mar 2026"
            />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Category *</span>
            <select
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Document date</span>
            <input
              type="date"
              value={docDate}
              onChange={(e) => setDocDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">File *</span>
            <input
              required
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,image/*,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-sm"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="font-medium text-slate-700">Description</span>
            <input
              value={docDesc}
              onChange={(e) => setDocDesc(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={uploading}
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60 sm:col-span-2 sm:w-fit"
          >
            {uploading ? 'Uploading…' : 'Upload document'}
          </button>
        </form>

        {chart.documents.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No documents uploaded yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {chart.documents.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-900">{d.title}</p>
                  <p className="text-xs text-slate-500">
                    {d.category.replace(/_/g, ' ')}
                    {d.documentDate ? ` · ${d.documentDate}` : ''} · {d.fileName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadDoc(d.id, d.fileName)}
                  className="font-medium text-teal-700 hover:underline"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value || '—'}</dd>
    </div>
  );
}

function ChipList({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{title}</p>
      {items?.length ? (
        <ul className="mt-1 flex flex-wrap gap-1">
          {items.map((i) => (
            <li key={i} className="rounded-md bg-teal-50 px-2 py-0.5 text-xs text-teal-900">
              {i}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-slate-500">{empty}</p>
      )}
    </div>
  );
}
