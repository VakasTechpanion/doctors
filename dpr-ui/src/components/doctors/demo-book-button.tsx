'use client';

import Link from 'next/link';

export function DemoBookButton({ slug, onlineAvailable }: { slug: string; onlineAvailable: boolean }) {
  return (
    <div className="mt-6 space-y-2">
      <Link
        href={`/checkout/appointment/${slug}?type=clinic`}
        className="block w-full rounded-lg bg-teal-700 py-3 text-center text-sm font-semibold text-white hover:bg-teal-800"
      >
        Book & pay — in-clinic (demo)
      </Link>
      {onlineAvailable && (
        <Link
          href={`/checkout/appointment/${slug}?type=online`}
          className="block w-full rounded-lg border border-teal-700 py-3 text-center text-sm font-semibold text-teal-800 hover:bg-teal-50"
        >
          Book & pay — online (demo)
        </Link>
      )}
    </div>
  );
}
