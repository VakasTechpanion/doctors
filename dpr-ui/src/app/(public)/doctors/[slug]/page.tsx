import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DemoBookButton } from '@/components/doctors/demo-book-button';
import { formatInr, getDoctorBySlug } from '@/lib/demo-data';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { DEMO_DOCTORS } = await import('@/lib/demo-data');
  return DEMO_DOCTORS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) return { title: 'Doctor not found' };
  return {
    title: `Dr. ${doctor.firstName} ${doctor.lastName} | MediConnect`,
  };
}

export default async function DoctorProfilePage({ params }: Props) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) notFound();

  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/doctors" className="text-sm font-medium text-teal-700 hover:underline">
        ← Back to search
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-800">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h1>
                <p className="text-teal-800">{doctor.specialty}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {doctor.city}, {doctor.state} · {doctor.experienceYears} years experience
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {doctor.verified && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      Verified
                    </span>
                  )}
                  <span className="text-sm text-slate-600">
                    ★ {doctor.rating} · {doctor.reviewCount} reviews
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-6 text-slate-700">{doctor.bio}</p>
            <p className="mt-4 text-sm text-slate-600">
              <span className="font-medium text-slate-800">Languages:</span>{' '}
              {doctor.languages.join(', ')}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-medium text-slate-800">Clinic:</span> {doctor.clinicName}
            </p>
          </div>
        </div>

        <div className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <p className="text-sm text-slate-500">Consultation fee</p>
          <p className="text-3xl font-bold text-slate-900">{formatInr(doctor.feeInr)}</p>
          <p className="mt-2 text-sm font-medium text-teal-700">Next slot: {doctor.nextSlot}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {doctor.consultationTypes.includes('IN_CLINIC') && <li>✓ In-clinic visit</li>}
            {doctor.consultationTypes.includes('ONLINE') && <li>✓ Online video consult</li>}
          </ul>
          <DemoBookButton
            slug={doctor.slug}
            onlineAvailable={doctor.consultationTypes.includes('ONLINE')}
          />
          <p className="mt-2 text-center text-xs text-slate-500">
            Demo checkout with platform fee — Razorpay later.
          </p>
        </div>
      </div>
    </div>
  );
}
