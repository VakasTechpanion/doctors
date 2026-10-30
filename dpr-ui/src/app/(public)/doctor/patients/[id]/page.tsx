'use client';

import { use } from 'react';
import { PatientChartView } from '@/components/patients/patient-chart';

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <PatientChartView patientId={id} />;
}
