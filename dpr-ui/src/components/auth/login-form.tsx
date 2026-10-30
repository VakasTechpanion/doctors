'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import { apiLogin } from '@/lib/api';
import { dashboardPathForRole, setSessionFromAuth } from '@/lib/demo-auth';
import { notifySessionChanged } from '@/lib/session';
import { PasswordInput } from './password-input';

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await apiLogin({ email, password });
      setSessionFromAuth(result.user, result.accessToken);
      notifySessionChanged();
      const next = searchParams.get('next');
      router.push(next || dashboardPathForRole(result.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Is the API running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <label className="block text-sm">
        <span className="font-medium text-slate-700">Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          autoComplete="email"
        />
      </label>
      <PasswordInput
        label="Password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        required
        minLength={8}
      />

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
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-slate-600">
        New to MediConnect?{' '}
        <Link href="/signup" className="font-medium text-teal-700 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-slate-100" />}>
      <LoginFormInner />
    </Suspense>
  );
}
