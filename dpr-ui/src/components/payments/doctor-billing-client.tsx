'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DEMO_PLANS, formatInr } from '@/lib/demo-data';
import {
  DEMO_BILLING_HISTORY,
  DemoDoctorSubscription,
  DemoPaymentRecord,
} from '@/lib/demo-payments';
import { clearDemoSubscription, getDemoSubscription, getDemoUserPayments } from '@/lib/demo-store';

export function DoctorBillingClient() {
  const [sub, setSub] = useState<DemoDoctorSubscription | null>(null);
  const [payments, setPayments] = useState<DemoPaymentRecord[]>([]);

  useEffect(() => {
    setSub(getDemoSubscription());
    const userPay = getDemoUserPayments().filter((p) => p.purpose === 'SUBSCRIPTION' || p.purpose === 'APPOINTMENT');
    setPayments([...userPay, ...DEMO_BILLING_HISTORY].slice(0, 12));
  }, []);

  const plan = sub ? DEMO_PLANS.find((p) => p.code === sub.planCode) : null;

  const appointmentEarnings = payments
    .filter((p) => p.purpose === 'APPOINTMENT' && p.status === 'CAPTURED')
    .reduce((s, p) => s + (p.netToDoctorInr ?? 0), 0);

  const platformFees = payments
    .filter((p) => p.purpose === 'APPOINTMENT')
    .reduce((s, p) => s + p.platformFeeInr, 0);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Subscription</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {plan ? plan.name : 'None'}
          </p>
          {sub && (
            <p className="mt-1 text-sm capitalize text-teal-700">{sub.status}</p>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Consultation earnings (demo)</p>
          <p className="mt-1 text-xl font-bold text-emerald-700">{formatInr(appointmentEarnings)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Platform fees collected</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{formatInr(platformFees)}</p>
        </div>
      </section>

      {!sub && (
        <div className="rounded-xl border border-dashed border-teal-300 bg-teal-50/50 p-6 text-center">
          <p className="text-slate-700">No active subscription in this browser.</p>
          <Link href="/pricing" className="mt-3 inline-block text-sm font-semibold text-teal-800 hover:underline">
            View plans →
          </Link>
        </div>
      )}

      {sub && (
        <div className="flex flex-wrap gap-3">
          {sub.trialEndsAt && (
            <p className="text-sm text-slate-600">
              Trial ends: {new Date(sub.trialEndsAt).toLocaleDateString('en-IN')}
            </p>
          )}
          {sub.nextBillingDate && sub.status === 'active' && (
            <p className="text-sm text-slate-600">
              Next billing: {new Date(sub.nextBillingDate).toLocaleDateString('en-IN')}
            </p>
          )}
          <button
            type="button"
            className="text-sm text-red-600 hover:underline"
            onClick={() => {
              clearDemoSubscription();
              setSub(null);
            }}
          >
            Cancel subscription (demo)
          </button>
        </div>
      )}

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Payment & settlement history</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Receipt</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Platform fee</th>
                <th className="px-4 py-3">Your share</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{p.receiptNumber}</p>
                    <p className="text-xs text-slate-500">{p.description}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{p.purpose.toLowerCase()}</td>
                  <td className="px-4 py-3">{formatInr(p.amountInr)}</td>
                  <td className="px-4 py-3">{p.platformFeeInr ? formatInr(p.platformFeeInr) : '—'}</td>
                  <td className="px-4 py-3">
                    {p.netToDoctorInr != null ? formatInr(p.netToDoctorInr) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
