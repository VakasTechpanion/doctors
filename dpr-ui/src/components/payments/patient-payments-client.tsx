'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatInr } from '@/lib/demo-data';
import { DemoPaymentRecord } from '@/lib/demo-payments';
import { getDemoUserPayments } from '@/lib/demo-store';

const SEED_PATIENT_PAYMENTS: DemoPaymentRecord[] = [
  {
    id: 'pat_seed_1',
    purpose: 'APPOINTMENT',
    status: 'CAPTURED',
    amountInr: 800,
    platformFeeInr: 40,
    description: 'Dr. Ananya Sharma · In-clinic · 12 Oct',
    paidAt: '2025-10-12T11:30:00.000Z',
    receiptNumber: 'RCP-2025-8812',
    doctorSlug: 'ananya-sharma',
  },
];

export function PatientPaymentsClient() {
  const [payments, setPayments] = useState<DemoPaymentRecord[]>([]);

  useEffect(() => {
    const user = getDemoUserPayments().filter((p) => p.purpose === 'APPOINTMENT');
    setPayments([...user, ...SEED_PATIENT_PAYMENTS]);
  }, []);

  return (
    <div className="space-y-4">
      {payments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
          No payments yet.{' '}
          <Link href="/doctors" className="font-medium text-teal-700 hover:underline">
            Book a doctor
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {payments.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-medium text-slate-900">{p.receiptNumber}</p>
                <p className="text-sm text-slate-600">{p.description}</p>
                <p className="text-xs text-slate-500">
                  {new Date(p.paidAt).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{formatInr(p.amountInr)}</p>
                <span className="text-xs text-emerald-700">{p.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
