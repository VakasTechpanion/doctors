'use client';

import Link from 'next/link';
import { getDemoSubscription } from '@/lib/demo-store';
import { useEffect, useState } from 'react';

export function PricingPlanActions({
  planCode,
  priceInr,
}: {
  planCode: string;
  priceInr: number;
}) {
  const [activePlan, setActivePlan] = useState<string | null>(null);

  useEffect(() => {
    setActivePlan(getDemoSubscription()?.planCode ?? null);
  }, []);

  if (activePlan === planCode) {
    return (
      <Link
        href="/doctor/billing"
        className="mt-6 block w-full rounded-lg bg-emerald-600 py-2 text-center text-sm font-medium text-white hover:bg-emerald-700"
      >
        Current plan · Manage billing
      </Link>
    );
  }

  return (
    <Link
      href={`/subscribe/${planCode}`}
      className="mt-6 block w-full rounded-lg border border-teal-700 py-2 text-center text-sm font-medium text-teal-800 hover:bg-teal-50"
    >
      {priceInr === 0 ? 'Start free trial' : 'Subscribe (demo)'}
    </Link>
  );
}
