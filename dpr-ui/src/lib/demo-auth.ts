'use client';

import type { ApiUser, ApiUserRole } from './api';

export type DemoUserRole = 'PATIENT' | 'DOCTOR' | 'CLINIC_OWNER';

export type DemoSession = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: DemoUserRole | ApiUserRole;
  signedInAt: string;
  accessToken?: string;
};

const SESSION_KEY = 'mediconnect_demo_session';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getDemoSession(): DemoSession | null {
  return readJson<DemoSession | null>(SESSION_KEY, null);
}

export function clearDemoSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function setSessionFromAuth(user: ApiUser, accessToken: string): DemoSession {
  const session: DemoSession = {
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    signedInAt: new Date().toISOString(),
    accessToken,
  };
  writeJson(SESSION_KEY, session);
  return session;
}

export function dashboardPathForRole(role: string): string {
  if (role === 'DOCTOR' || role === 'CLINIC_OWNER') return '/doctor';
  return '/patient';
}
