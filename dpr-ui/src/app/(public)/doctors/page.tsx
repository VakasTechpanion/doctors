import { LiveDoctorsDirectory } from '@/components/doctors/live-doctors-directory';

export const metadata = {
  title: 'Find doctors | MediConnect',
};

export default function DoctorsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Find a doctor</h1>
      <p className="mt-2 text-slate-600">
        Doctors who signed up on MediConnect (live from MongoDB). Book with a patient account to create
        a real appointment on their dashboard.
      </p>
      <div className="mt-8">
        <LiveDoctorsDirectory />
      </div>
    </div>
  );
}
