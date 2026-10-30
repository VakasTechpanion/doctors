import Link from 'next/link';
import { PatientPaymentsClient } from '@/components/payments/patient-payments-client';

export const metadata = { title: 'Payment history (demo) | MediConnect' };

export default function PatientPaymentsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/patient" className="text-sm font-medium text-teal-700 hover:underline">
        ← Patient dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Payments & receipts</h1>
      <p className="mt-2 text-slate-600">Demo payment history including bookings you complete in checkout.</p>
      <div className="mt-8">
        <PatientPaymentsClient />
      </div>
    </div>
  );
}
