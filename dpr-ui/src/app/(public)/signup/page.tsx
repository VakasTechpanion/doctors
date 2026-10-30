import Link from 'next/link';
import { SignUpForm } from '@/components/auth/signup-form';

export const metadata = { title: 'Sign up | MediConnect' };

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium text-teal-700">Create your account</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Sign up</h1>
      <p className="mt-2 text-slate-600">
        Accounts are saved in MongoDB Atlas via the NestJS API. Start the API first, then register.
      </p>
      <div className="mt-8">
        <SignUpForm />
      </div>
      <p className="mt-6 text-center text-xs text-slate-500">
        Prefer to explore first?{' '}
        <Link href="/doctors" className="text-teal-700 hover:underline">
          Browse doctors
        </Link>
      </p>
    </div>
  );
}
