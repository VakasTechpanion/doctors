'use client';

import { FormEvent, useState } from 'react';
import { CreatePatientInput } from '@/lib/api';

const GENDERS = ['MALE', 'FEMALE', 'OTHER', 'UNSPECIFIED'];
const BLOOD = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

function splitCsv(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

type Props = {
  initial?: Partial<CreatePatientInput>;
  submitLabel: string;
  onSubmit: (data: CreatePatientInput) => Promise<void>;
};

export function PatientForm({ initial, submitLabel, onSubmit }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: initial?.firstName ?? '',
    lastName: initial?.lastName ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    dateOfBirth: initial?.dateOfBirth ?? '',
    gender: initial?.gender ?? 'UNSPECIFIED',
    bloodGroup: initial?.bloodGroup ?? '',
    addressLine1: initial?.addressLine1 ?? '',
    city: initial?.city ?? '',
    state: initial?.state ?? '',
    pincode: initial?.pincode ?? '',
    emergencyName: initial?.emergencyName ?? '',
    emergencyPhone: initial?.emergencyPhone ?? '',
    allergies: (initial?.allergies ?? []).join(', '),
    chronicConditions: (initial?.chronicConditions ?? []).join(', '),
    currentMedications: (initial?.currentMedications ?? []).join(', '),
    clinicalNotes: initial?.clinicalNotes ?? '',
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email || undefined,
        phone: form.phone || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender,
        bloodGroup: form.bloodGroup || undefined,
        addressLine1: form.addressLine1 || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        pincode: form.pincode || undefined,
        emergencyName: form.emergencyName || undefined,
        emergencyPhone: form.emergencyPhone || undefined,
        allergies: splitCsv(form.allergies),
        chronicConditions: splitCsv(form.chronicConditions),
        currentMedications: splitCsv(form.currentMedications),
        clinicalNotes: form.clinicalNotes || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  const field =
    'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Demographics
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="font-medium text-slate-700">First name *</span>
            <input required className={field} value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Last name *</span>
            <input required className={field} value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Email</span>
            <input type="email" className={field} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Phone</span>
            <input className={field} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91…" />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Date of birth</span>
            <input type="date" className={field} value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Gender</span>
            <select className={field} value={form.gender} onChange={(e) => set('gender', e.target.value)}>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Blood group</span>
            <select className={field} value={form.bloodGroup} onChange={(e) => set('bloodGroup', e.target.value)}>
              <option value="">Select</option>
              {BLOOD.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Address & emergency contact
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">
            <span className="font-medium text-slate-700">Address</span>
            <input className={field} value={form.addressLine1} onChange={(e) => set('addressLine1', e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">City</span>
            <input className={field} value={form.city} onChange={(e) => set('city', e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">State</span>
            <input className={field} value={form.state} onChange={(e) => set('state', e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Pincode</span>
            <input className={field} value={form.pincode} onChange={(e) => set('pincode', e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Emergency contact name</span>
            <input className={field} value={form.emergencyName} onChange={(e) => set('emergencyName', e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Emergency phone</span>
            <input className={field} value={form.emergencyPhone} onChange={(e) => set('emergencyPhone', e.target.value)} />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Clinical details
        </h2>
        <p className="mt-1 text-xs text-slate-500">Use commas to separate multiple items.</p>
        <div className="mt-4 grid gap-4">
          <label className="text-sm">
            <span className="font-medium text-slate-700">Allergies</span>
            <input className={field} value={form.allergies} onChange={(e) => set('allergies', e.target.value)} placeholder="Penicillin, Peanuts" />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Chronic conditions</span>
            <input className={field} value={form.chronicConditions} onChange={(e) => set('chronicConditions', e.target.value)} placeholder="Hypertension, Diabetes mellitus" />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Current medications</span>
            <input className={field} value={form.currentMedications} onChange={(e) => set('currentMedications', e.target.value)} placeholder="Metformin 500mg BD" />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-700">Clinical notes</span>
            <textarea
              rows={4}
              className={field}
              value={form.clinicalNotes}
              onChange={(e) => set('clinicalNotes', e.target.value)}
              placeholder="Visit history, observations, follow-up plan…"
            />
          </label>
        </div>
      </section>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
      >
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
