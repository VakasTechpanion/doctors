const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export type ApiUserRole = 'PATIENT' | 'DOCTOR' | 'CLINIC_OWNER' | 'CLINIC_STAFF' | 'PLATFORM_ADMIN';

export type ApiUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: ApiUserRole;
};

export type AuthResponse = {
  user: ApiUser;
  accessToken: string;
};

export type DoctorDashboard = {
  doctor: ApiUser;
  stats: {
    todayCount: number;
    completed: number;
    revenueTodayInr: number;
  };
  schedule: Array<{
    id: string;
    time: string;
    patient: string;
    type: string;
    status: string;
    feeInr: number;
  }>;
};

export type PatientDashboard = {
  patient: ApiUser;
  upcomingAppointments: Array<{
    id: string;
    doctorName: string;
    specialty: string;
    when: string;
    clinic: string;
    type: string;
    status: string;
    feeInr: number;
  }>;
  recentVisits: Array<{
    id: string;
    doctorName: string;
    when: string;
    feeInr: number;
  }>;
};

export type DirectoryDoctor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: { code?: string; message?: string; details?: unknown };
};

async function parseJson<T>(res: Response): Promise<T> {
  const body = (await res.json()) as ApiEnvelope<T> & {
    message?: string | string[];
    error?: { code?: string; message?: string };
  };
  if (!res.ok) {
    const raw =
      body.error?.message ||
      (Array.isArray(body.message) ? body.message.join(', ') : body.message) ||
      `Request failed (${res.status})`;
    throw new Error(raw);
  }
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    return (body as ApiEnvelope<T>).data as T;
  }
  return body as T;
}

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function apiRegister(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'PATIENT' | 'DOCTOR' | 'CLINIC_OWNER';
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseJson<AuthResponse>(res);
}

export async function apiLogin(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseJson<AuthResponse>(res);
}

export async function apiMe(accessToken: string): Promise<ApiUser> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return parseJson<ApiUser>(res);
}

export async function apiDoctorDashboard(token: string): Promise<DoctorDashboard> {
  const res = await fetch(`${API_BASE}/doctors/me/dashboard`, {
    headers: authHeaders(token),
  });
  return parseJson<DoctorDashboard>(res);
}

export async function apiPatientDashboard(token: string): Promise<PatientDashboard> {
  const res = await fetch(`${API_BASE}/patients/me/dashboard`, {
    headers: authHeaders(token),
  });
  return parseJson<PatientDashboard>(res);
}

export async function apiListDoctors(): Promise<DirectoryDoctor[]> {
  const res = await fetch(`${API_BASE}/doctors/directory`);
  return parseJson<DirectoryDoctor[]>(res);
}

export async function apiCreateAppointment(
  token: string,
  input: {
    doctorId: string;
    consultationType: 'IN_CLINIC' | 'ONLINE';
    startsAt: string;
    feeInr: number;
    specialty?: string;
    clinicName?: string;
    receiptNumber?: string;
  },
) {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  return parseJson(res);
}

export async function apiUpdateAppointmentStatus(
  token: string,
  id: string,
  status: string,
) {
  const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
  return parseJson(res);
}

export type ClinicPatient = {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  clinicalNotes?: string;
  isActive: boolean;
};

export type PatientDocumentMeta = {
  id: string;
  title: string;
  category: string;
  description?: string;
  documentDate?: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt?: string;
};

export type PatientChart = {
  patient: ClinicPatient;
  documents: PatientDocumentMeta[];
};

export type CreatePatientInput = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  clinicalNotes?: string;
};

export async function apiListClinicPatients(token: string, q?: string): Promise<ClinicPatient[]> {
  const url = new URL(`${API_BASE}/doctors/me/patients`);
  if (q) url.searchParams.set('q', q);
  const res = await fetch(url.toString(), { headers: authHeaders(token) });
  return parseJson<ClinicPatient[]>(res);
}

export async function apiCreateClinicPatient(
  token: string,
  input: CreatePatientInput,
): Promise<ClinicPatient> {
  const res = await fetch(`${API_BASE}/doctors/me/patients`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  return parseJson<ClinicPatient>(res);
}

export async function apiGetClinicPatient(token: string, id: string): Promise<PatientChart> {
  const res = await fetch(`${API_BASE}/doctors/me/patients/${id}`, {
    headers: authHeaders(token),
  });
  return parseJson<PatientChart>(res);
}

export async function apiUpdateClinicPatient(
  token: string,
  id: string,
  input: CreatePatientInput,
): Promise<ClinicPatient> {
  const res = await fetch(`${API_BASE}/doctors/me/patients/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  return parseJson<ClinicPatient>(res);
}

export async function apiArchiveClinicPatient(token: string, id: string) {
  const res = await fetch(`${API_BASE}/doctors/me/patients/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return parseJson(res);
}

export async function apiUploadPatientDocument(
  token: string,
  patientId: string,
  form: FormData,
) {
  const res = await fetch(`${API_BASE}/doctors/me/patients/${patientId}/documents`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  return parseJson(res);
}

export function patientDocumentDownloadUrl(documentId: string): string {
  return `${API_BASE}/doctors/me/patients/documents/${documentId}/download`;
}

export function getApiBase(): string {
  return API_BASE;
}
