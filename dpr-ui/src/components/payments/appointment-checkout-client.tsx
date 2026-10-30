'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiCreateAppointment } from '@/lib/api';
import { getDemoSession } from '@/lib/demo-auth';
import { calcDoctorNet, calcPlatformFee, DEMO_PLATFORM_COMMISSION_BPS, generateReceiptNumber } from '@/lib/demo-payments';
import { formatInr } from '@/lib/format';

type Props = {
  doctorId?: string;
  doctorSlug: string;
  doctorName: string;
  feeInr: number;
  slotLabel: string;
  consultationType: 'In-clinic' | 'Online';
  specialty?: string;
  clinicName?: string;
};

export function AppointmentCheckoutClient(props: Props) {
  const router = useRouter();
  const [method, setMethod] = useState<'upi' | 'card'>('upi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const platformFee = calcPlatformFee(props.feeInr);

  async function handlePay() {
    setError(null);
    setLoading(true);
    try {
      const session = getDemoSession();
      if (!session?.accessToken || session.role !== 'PATIENT') {
        router.push(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }

      if (!props.doctorId) {
        setError('This sample profile cannot be booked. Choose a registered doctor from Find doctors.');
        return;
      }

      const startsAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      const receiptNumber = generateReceiptNumber('RCP');

      await apiCreateAppointment(session.accessToken, {
        doctorId: props.doctorId,
        consultationType: props.consultationType === 'Online' ? 'ONLINE' : 'IN_CLINIC',
        startsAt,
        feeInr: props.feeInr,
        specialty: props.specialty ?? 'General consultation',
        clinicName: props.clinicName ?? 'MediConnect clinic',
        receiptNumber,
      });

      const { payForAppointment } = await import('@/lib/demo-store');
      payForAppointment({
        doctorSlug: props.doctorSlug,
        doctorName: props.doctorName,
        feeInr: props.feeInr,
        slotLabel: props.slotLabel,
        type: props.consultationType,
      });

      router.push(
        `/payment/success?type=appointment&receipt=${encodeURIComponent(receiptNumber)}&amount=${props.feeInr}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment / booking failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
        <h2 className="font-semibold text-slate-900">Payment method</h2>
        <p className="text-sm text-slate-500">
          Checkout records the appointment in MongoDB. Razorpay live keys can replace this later.
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
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
        ) : null}
        <button
          type="button"
          disabled={loading}
          onClick={handlePay}
          className="w-full rounded-lg bg-teal-700 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {loading ? 'Processing…' : `Pay ${formatInr(props.feeInr)}`}
        </button>
      </div>

      <aside className="h-fit rounded-xl border border-slate-200 bg-slate-50 p-6 lg:col-span-2">
        <h3 className="font-semibold text-slate-900">Order summary</h3>
        <p className="mt-2 text-sm font-medium text-slate-900">{props.doctorName}</p>
        <p className="text-sm text-slate-600">
          {props.consultationType} · {props.slotLabel}
        </p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">Subtotal</dt>
            <dd>{formatInr(props.feeInr)}</dd>
          </div>
          <div className="flex justify-between text-slate-600">
            <dt>Platform fee ({DEMO_PLATFORM_COMMISSION_BPS / 100}%)</dt>
            <dd>{formatInr(platformFee)}</dd>
          </div>
          <div className="flex justify-between text-slate-600">
            <dt>Doctor receives</dt>
            <dd>{formatInr(calcDoctorNet(props.feeInr))}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
            <dt>Total due</dt>
            <dd>{formatInr(props.feeInr)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
