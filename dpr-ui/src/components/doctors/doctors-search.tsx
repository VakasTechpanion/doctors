'use client';

import { useMemo, useState } from 'react';
import {
  DEMO_CITIES,
  DEMO_DOCTORS,
  DEMO_SPECIALTIES,
  DemoDoctor,
} from '@/lib/demo-data';
import { DoctorCard } from './doctor-card';

type Filters = {
  q: string;
  city: string;
  specialty: string;
  onlineOnly: boolean;
};

function filterDoctors(list: DemoDoctor[], f: Filters): DemoDoctor[] {
  return list.filter((d) => {
    if (f.city && d.city !== f.city) return false;
    if (f.specialty && d.specialtySlug !== f.specialty) return false;
    if (f.onlineOnly && !d.consultationTypes.includes('ONLINE')) return false;
    if (f.q) {
      const hay = `${d.firstName} ${d.lastName} ${d.specialty} ${d.city}`.toLowerCase();
      if (!hay.includes(f.q.toLowerCase())) return false;
    }
    return true;
  });
}

export function DoctorsSearch() {
  const [filters, setFilters] = useState<Filters>({
    q: '',
    city: '',
    specialty: '',
    onlineOnly: false,
  });

  const results = useMemo(() => filterDoctors(DEMO_DOCTORS, filters), [filters]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block sm:col-span-2 lg:col-span-2">
            <span className="text-xs font-medium text-slate-600">Search</span>
            <input
              type="search"
              placeholder="Doctor name or specialty"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-teal-600/20 focus:border-teal-600 focus:ring-2"
              value={filters.q}
              onChange={(e) => setFilters((s) => ({ ...s, q: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600">City</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              value={filters.city}
              onChange={(e) => setFilters((s) => ({ ...s, city: e.target.value }))}
            >
              <option value="">All cities</option>
              {DEMO_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600">Specialty</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              value={filters.specialty}
              onChange={(e) => setFilters((s) => ({ ...s, specialty: e.target.value }))}
            >
              <option value="">All specialties</option>
              {DEMO_SPECIALTIES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.onlineOnly}
            onChange={(e) => setFilters((s) => ({ ...s, onlineOnly: e.target.checked }))}
            className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
          />
          Online consultation available
        </label>
      </div>

      <p className="text-sm text-slate-600">
        Showing <strong>{results.length}</strong> doctors (demo data)
      </p>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
          No doctors match your filters. Try clearing city or specialty.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((d) => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>
      )}
    </div>
  );
}
