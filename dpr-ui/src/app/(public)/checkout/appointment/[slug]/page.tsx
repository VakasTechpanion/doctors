import Link from 'next/link';
import { AppointmentCheckoutClient } from '@/components/payments/appointment-checkout-client';
import { getDoctorBySlug } from '@/lib/demo-data';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string; live?: string; name?: string; fee?: string }>;
};

export default async function AppointmentCheckoutPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const q = await searchParams;
  const isLive = q.live === '1';
  const demoDoctor = !isLive ? getDoctorBySlug(slug) : undefined;

  const doctorName =
    q.name ||
    (demoDoctor ? `Dr. ${demoDoctor.firstName} ${demoDoctor.lastName}` : 'Doctor');
  const feeInr = q.fee ? Number(q.fee) : demoDoctor?.feeInr ?? 800;
  const consultationType = q.type === 'online' ? 'Online' : 'In-clinic';
  const slotLabel = demoDoctor?.nextSlot ?? 'Next available slot (today + 2h)';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/doctors" className="text-sm font-medium text-teal-700 hover:underline">
        ← Back to doctors
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Pay for appointment</h1>
      <p className="mt-2 text-slate-600">
        {isLive
          ? 'Payment creates a real appointment for this doctor in MongoDB.'
          : 'Sample doctor profile — use Find doctors for registered doctors.'}
      </p>
      <div className="mt-8">
        <AppointmentCheckoutClient
          doctorId={isLive ? slug : undefined}
          doctorSlug={slug}
          doctorName={doctorName}
          feeInr={feeInr}
          slotLabel={slotLabel}
          consultationType={consultationType}
          specialty={demoDoctor?.specialty}
          clinicName={demoDoctor?.clinicName}
        />
      </div>
    </div>
  );
}
