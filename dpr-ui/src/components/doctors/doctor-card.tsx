import Link from 'next/link';
import { DemoDoctor, formatInr } from '@/lib/demo-data';
import { cn } from '@/lib/utils';

export function DoctorCard({ doctor }: { doctor: DemoDoctor }) {
  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`;
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-md">
      <div className="flex gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg font-semibold text-teal-800">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900">
              Dr. {doctor.firstName} {doctor.lastName}
            </h3>
            {doctor.verified ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                Verified
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                Pending
              </span>
            )}
          </div>
          <p className="text-sm text-teal-800">{doctor.specialty}</p>
          <p className="text-sm text-slate-500">
            {doctor.city}, {doctor.state} · {doctor.experienceYears} yrs exp.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {doctor.consultationTypes.includes('IN_CLINIC') && (
          <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">In-clinic</span>
        )}
        {doctor.consultationTypes.includes('ONLINE') && (
          <span className="rounded-md bg-sky-50 px-2 py-1 text-sky-800">Online</span>
        )}
        <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
          ★ {doctor.rating} ({doctor.reviewCount})
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-500">Consultation from</p>
          <p className="font-semibold text-slate-900">{formatInr(doctor.feeInr)}</p>
          <p className="text-xs text-teal-700">{doctor.nextSlot}</p>
        </div>
        <Link
          href={`/doctors/${doctor.slug}`}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium',
            'bg-teal-700 text-white hover:bg-teal-800',
          )}
        >
          View profile
        </Link>
      </div>
    </article>
  );
}
