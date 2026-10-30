import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DemoCheckoutForm } from '@/components/payments/demo-checkout-form';
import { getPlanByCode } from '@/lib/demo-payments';

type Props = { params: Promise<{ planCode: string }> };

export async function generateStaticParams() {
  const { DEMO_PLANS } = await import('@/lib/demo-data');
  return DEMO_PLANS.map((p) => ({ planCode: p.code }));
}

export default async function SubscribePage({ params }: Props) {
  const { planCode } = await params;
  const plan = getPlanByCode(planCode);
  if (!plan) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/pricing" className="text-sm font-medium text-teal-700 hover:underline">
        ← Back to pricing
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Subscribe to {plan.name}</h1>
      <p className="mt-2 text-slate-600">
        Demo checkout for doctor SaaS billing. Real Razorpay integration will replace this flow.
      </p>
      <div className="mt-8">
        <DemoCheckoutForm
          config={{
            mode: 'subscription',
            planCode: plan.code,
            planName: plan.name,
            amountInr: plan.priceInr,
          }}
        />
      </div>
    </div>
  );
}
