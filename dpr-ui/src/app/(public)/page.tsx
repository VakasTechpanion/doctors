import Link from 'next/link';
import { LiveDoctorsDirectory } from '@/components/doctors/live-doctors-directory';

export default function HomePage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-br from-teal-50 via-white to-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Healthcare SaaS for India
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Book trusted doctors. Manage care in one place.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            Doctors manage patient charts and clinical documents. Patients book registered doctors.
            Data is stored in MongoDB Atlas via the NestJS API.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/doctors"
              className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
            >
              Find a doctor
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Registered doctors</h2>
            <p className="mt-1 text-slate-600">Live directory from your MongoDB users collection.</p>
          </div>
          <Link href="/doctors" className="text-sm font-medium text-teal-700 hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-8">
          <LiveDoctorsDirectory />
        </div>
      </section>
    </>
  );
}
