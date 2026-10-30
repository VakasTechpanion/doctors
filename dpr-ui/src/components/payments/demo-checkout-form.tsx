'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatInr } from '@/lib/demo-data';
import { calcDoctorNet, calcPlatformFee, DEMO_PLATFORM_COMMISSION_BPS } from '@/lib/demo-payments';

type SubscriptionCheckout = {
  mode: 'subscription';
  planCode: string;
  planName: string;
  amountInr: number;
};

type AppointmentCheckout = {
  mode: 'appointment';
  doctorSlug: string;
  doctorName: string;
  feeInr: number;
  slotLabel: string;
  consultationType: 'In-clinic' | 'Online';
};

export type CheckoutConfig = SubscriptionCheckout | AppointmentCheckout;

export function DemoCheckoutForm({ config }: { config: CheckoutConfig }) {
  const router = useRouter();
  const [method, setMethod] = useState<'upi' | 'card'>('upi');
  const [loading, setLoading] = useState(false);

  const isAppointment = config.mode === 'appointment';
  const subtotal = config.amountInr;
  const platformFee = isAppointment ? calcPlatformFee(subtotal) : 0;
  const total = subtotal;

  async function handlePay() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    if (config.mode === 'subscription') {
      const { subscribeToPlan } = await import('@/lib/demo-store');
      subscribeToPlan(config.planCode, config.amountInr);
      router.push(
        `/payment/success?type=subscription&plan=${config.planCode}&amount=${config.amountInr}`,
      );
    } else {
      const { payForAppointment } = await import('@/lib/demo-store');
      const record = payForAppointment({
        doctorSlug: config.doctorSlug,
        doctorName: config.doctorName,
        feeInr: config.feeInr,
        slotLabel: config.slotLabel,
        type: config.consultationType,
      });
      router.push(
        `/payment/success?type=appointment&receipt=${encodeURIComponent(record.receiptNumber)}&amount=${config.feeInr}`,
      );
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">Payment method (demo)</h2>
        <p className="text-sm text-slate-500">
          Simulates Razorpay checkout. No real charge — stored in your browser only.
        </p>
        <div className="flex gap-2">
          {(['upi', 'card'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                method === m
                  ? 'bg-teal-700 text-white'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        {method === 'upi' ? (
          <label className="block text-sm">
            <span className="font-medium text-slate-700">UPI ID</span>
            <input
              readOnly
              value="demo@upi"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            />
          </label>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-slate-700">Card number</span>
              <input
                readOnly
                value="4111 1111 1111 1111"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Expiry</span>
              <input readOnly value="12/28" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">CVV</span>
              <input readOnly value="***" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2" />
            </label>
          </div>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={handlePay}
          className="w-full rounded-lg bg-teal-700 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {loading ? 'Processing…' : `Pay ${formatInr(total)} (demo)`}
        </button>
      </div>

      <aside className="lg:col-span-2 h-fit rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="font-semibold text-slate-900">Order summary</h3>
        {config.mode === 'subscription' ? (
          <p className="mt-2 text-sm text-slate-600">{config.planName} subscription</p>
        ) : (
          <>
            <p className="mt-2 text-sm font-medium text-slate-900">{config.doctorName}</p>
            <p className="text-sm text-slate-600">{config.consultationType} · {config.slotLabel}</p>
          </>
        )}
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">Subtotal</dt>
            <dd>{formatInr(subtotal)}</dd>
          </div>
          {isAppointment && (
            <>
              <div className="flex justify-between text-slate-600">
                <dt>Platform fee ({DEMO_PLATFORM_COMMISSION_BPS / 100}%)</dt>
                <dd>{formatInr(platformFee)}</dd>
              </div>
              <div className="flex justify-between text-slate-600">
                <dt>Doctor receives (demo)</dt>
                <dd>{formatInr(calcDoctorNet(subtotal))}</dd>
              </div>
            </>
          )}
          <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
            <dt>Total due</dt>
            <dd>{formatInr(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
