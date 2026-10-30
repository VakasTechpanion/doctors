'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiRegister } from '@/lib/api';
import {
  dashboardPathForRole,
  DemoUserRole,
  setSessionFromAuth,
} from '@/lib/demo-auth';
import { notifySessionChanged } from '@/lib/session';
import { cn } from '@/lib/utils';
import { PasswordInput } from './password-input';

const roles: { value: DemoUserRole; label: string; hint: string }[] = [
  {
    value: 'PATIENT',
    label: 'Patient',
    hint: 'Book doctors, pay for visits, view prescriptions',
  },
  {
    value: 'DOCTOR',
    label: 'Doctor',
    hint: 'Manage schedule, patients, and subscriptions',
  },
  {
    value: 'CLINIC_OWNER',
    label: 'Clinic owner',
    hint: 'Run clinic operations and staff',
  },
];

export function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState<DemoUserRole>('PATIENT');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setError('Please accept the terms to continue.');
      return;
    }

    setLoading(true);
    try {
      const result = await apiRegister({
        email,
        password,
        firstName,
        lastName,
        phone: phone || undefined,
        role,
      });
      setSessionFromAuth(result.user, result.accessToken);
      notifySessionChanged();
      router.push(dashboardPathForRole(result.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Is the API running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-700">I am signing up as</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={cn(
                'rounded-lg border px-3 py-3 text-left transition',
                role === r.value
                  ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-600/20'
                  : 'border-slate-200 hover:border-slate-300',
              )}
            >
              <span className="block text-sm font-semibold text-slate-900">{r.label}</span>
              <span className="mt-1 block text-xs text-slate-500">{r.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">First name</span>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            placeholder="Ananya"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Last name</span>
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            placeholder="Sharma"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-slate-700">Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-slate-700">
          Phone <span className="font-normal text-slate-400">(optional)</span>
        </span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          placeholder="+91 98765 43210"
          autoComplete="tel"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          minLength={8}
        />
        <PasswordInput
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-0.5 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
        />
        <span>I agree to the Terms of Service and Privacy Policy.</span>
      </label>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-teal-700 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
