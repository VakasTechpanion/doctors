import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export const metadata = { title: 'Sign in | MediConnect' };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <p className="text-sm font-medium text-teal-700">Welcome back</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Sign in</h1>
      <p className="mt-2 text-slate-600">
        Sign in with the email and password you registered (stored in MongoDB Atlas).
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
      <div className="mt-6 space-y-2 text-center text-sm text-slate-600">
        <p>
          No account yet?{' '}
          <Link href="/signup" className="font-medium text-teal-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
