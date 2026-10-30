import { DoctorBillingClient } from '@/components/payments/doctor-billing-client';

export const metadata = { title: 'Doctor billing (demo) | MediConnect' };

export default function DoctorBillingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm font-medium text-teal-700">Monetization · Demo</p>
      <h1 className="text-2xl font-bold text-slate-900">Billing & earnings</h1>
      <p className="mt-2 text-slate-600">
        Subscriptions, consultation payouts, and platform fees — sample + your demo payments in this browser.
      </p>
      <div className="mt-8">
        <DoctorBillingClient />
      </div>
    </div>
  );
}
