import Link from 'next/link';
import { formatInr } from '@/lib/format';

type Props = {
  searchParams: Promise<{
    type?: string;
    plan?: string;
    amount?: string;
    receipt?: string;
  }>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const q = await searchParams;
  const amount = q.amount ? Number(q.amount) : 0;
  const isSub = q.type === 'subscription';

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl">
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">Payment successful</h1>
      <p className="mt-2 text-slate-600">
        {isSub
          ? `Your ${q.plan ?? 'plan'} subscription is recorded.`
          : 'Your appointment was created and will appear on the doctor and patient dashboards.'}
      </p>
      {amount > 0 && (
        <p className="mt-4 text-lg font-semibold text-teal-800">{formatInr(amount)} paid</p>
      )}
      {q.receipt && (
        <p className="mt-2 text-sm text-slate-500">Receipt: {decodeURIComponent(q.receipt)}</p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {isSub ? (
          <Link
            href="/doctor/billing"
            className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
          >
            View billing
          </Link>
        ) : (
          <Link
            href="/patient"
            className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Patient dashboard
          </Link>
        )}
        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
