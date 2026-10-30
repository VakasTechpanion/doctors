import Link from 'next/link';
import { PricingPlanActions } from '@/components/payments/pricing-plan-actions';
import { DEMO_PLANS, formatInr } from '@/lib/demo-data';
import { DEMO_PLATFORM_COMMISSION_BPS } from '@/lib/demo-payments';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Pricing | MediConnect' };

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900">Plans for doctors</h1>
        <p className="mt-2 text-slate-600">
          Demo subscription checkout (browser storage). Patient bookings include a{' '}
          <strong>{DEMO_PLATFORM_COMMISSION_BPS / 100}%</strong> platform fee on consultations.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-teal-200 bg-teal-50/80 px-4 py-3 text-sm text-teal-900">
        <strong>Revenue model (demo):</strong> Doctor MRR from plans below + platform commission on
        paid appointments. Try{' '}
        <Link href="/doctor/billing" className="font-semibold underline">
          doctor billing
        </Link>{' '}
        after subscribing.
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {DEMO_PLANS.map((plan) => (
          <div
            key={plan.code}
            className={cn(
              'flex flex-col rounded-xl border bg-white p-6 shadow-sm',
              plan.highlighted ? 'border-teal-600 ring-2 ring-teal-600/20' : 'border-slate-200',
            )}
          >
            {plan.highlighted && (
              <span className="mb-2 w-fit rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-800">
                Popular
              </span>
            )}
            <h2 className="text-lg font-bold text-slate-900">{plan.name}</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {plan.priceInr === 0 ? 'Free' : formatInr(plan.priceInr)}
              {plan.priceInr > 0 && (
                <span className="text-sm font-normal text-slate-500"> / {plan.interval}</span>
              )}
            </p>
            <p className="mt-3 text-sm text-slate-600">{plan.description}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-700">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-teal-600">✓</span> {f}
                </li>
              ))}
            </ul>
            <PricingPlanActions planCode={plan.code} priceInr={plan.priceInr} />
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-slate-500">
        Need a clinic plan?{' '}
        <Link href="/login" className="font-medium text-teal-700 hover:underline">
          Contact sales (demo)
        </Link>
      </p>
    </div>
  );
}
