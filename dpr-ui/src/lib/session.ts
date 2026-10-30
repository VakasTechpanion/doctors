'use client';

import { useEffect, useState } from 'react';
import { apiMe } from './api';
import {
  clearDemoSession,
  DemoSession,
  getDemoSession,
  setSessionFromAuth,
} from './demo-auth';

export const SESSION_EVENT = 'mediconnect-session-changed';

export function notifySessionChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SESSION_EVENT));
  }
}

export function useSession() {
  const [session, setSession] = useState<DemoSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const local = getDemoSession();
      if (!local?.accessToken) {
        if (!cancelled) {
          setSession(null);
          setLoading(false);
        }
        return;
      }

      try {
        const user = await apiMe(local.accessToken);
        const next = setSessionFromAuth(user, local.accessToken);
        if (!cancelled) setSession(next);
      } catch {
        clearDemoSession();
        if (!cancelled) setSession(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    const onChange = () => {
      setSession(getDemoSession());
    };
    window.addEventListener(SESSION_EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      cancelled = true;
      window.removeEventListener(SESSION_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  return { session, loading, setSession };
}

export { formatInr, formatWhen } from './format';
