/** Demo / seed UI data — replace with API calls later. */

export type ConsultationType = 'IN_CLINIC' | 'ONLINE' | 'BOTH';

export type DemoDoctor = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  specialty: string;
  specialtySlug: string;
  city: string;
  state: string;
  experienceYears: number;
  feeInr: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  consultationTypes: ConsultationType[];
  verified: boolean;
  bio: string;
  clinicName: string;
  nextSlot: string;
};

export type DemoPlan = {
  code: string;
  name: string;
  priceInr: number;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  highlighted?: boolean;
};

export const DEMO_SPECIALTIES = [
  { name: 'General Physician', slug: 'general-physician' },
  { name: 'Dermatology', slug: 'dermatology' },
  { name: 'Pediatrics', slug: 'pediatrics' },
  { name: 'Orthopedics', slug: 'orthopedics' },
  { name: 'Gynecology', slug: 'gynecology' },
];

export const DEMO_CITIES = ['Mumbai', 'Bengaluru', 'Delhi', 'Pune', 'Hyderabad'];

export const DEMO_DOCTORS: DemoDoctor[] = [
  {
    id: 'doc_1',
    slug: 'ananya-sharma',
    firstName: 'Ananya',
    lastName: 'Sharma',
    specialty: 'General Physician',
    specialtySlug: 'general-physician',
    city: 'Mumbai',
    state: 'Maharashtra',
    experienceYears: 12,
    feeInr: 800,
    rating: 4.8,
    reviewCount: 214,
    languages: ['English', 'Hindi', 'Marathi'],
    consultationTypes: ['IN_CLINIC', 'ONLINE'],
    verified: true,
    bio: 'MBBS, MD (Medicine). Focus on preventive care, diabetes, and hypertension management.',
    clinicName: 'Sharma Family Clinic, Andheri West',
    nextSlot: 'Today, 4:30 PM',
  },
  {
    id: 'doc_2',
    slug: 'rahul-mehta',
    firstName: 'Rahul',
    lastName: 'Mehta',
    specialty: 'Dermatology',
    specialtySlug: 'dermatology',
    city: 'Bengaluru',
    state: 'Karnataka',
    experienceYears: 9,
    feeInr: 1200,
    rating: 4.9,
    reviewCount: 156,
    languages: ['English', 'Hindi', 'Kannada'],
    consultationTypes: ['IN_CLINIC', 'ONLINE'],
    verified: true,
    bio: 'MD Dermatology. Acne, pigmentation, hair loss, and cosmetic dermatology consults.',
    clinicName: 'SkinFirst Centre, Indiranagar',
    nextSlot: 'Tomorrow, 10:00 AM',
  },
  {
    id: 'doc_3',
    slug: 'priya-nair',
    firstName: 'Priya',
    lastName: 'Nair',
    specialty: 'Pediatrics',
    specialtySlug: 'pediatrics',
    city: 'Pune',
    state: 'Maharashtra',
    experienceYears: 15,
    feeInr: 900,
    rating: 4.7,
    reviewCount: 302,
    languages: ['English', 'Hindi', 'Malayalam'],
    consultationTypes: ['IN_CLINIC'],
    verified: true,
    bio: 'DCH, MRCPCH. Newborn care, vaccinations, and adolescent health.',
    clinicName: 'LittleSteps Paediatrics, Kothrud',
    nextSlot: 'Today, 6:00 PM',
  },
  {
    id: 'doc_4',
    slug: 'vikram-singh',
    firstName: 'Vikram',
    lastName: 'Singh',
    specialty: 'Orthopedics',
    specialtySlug: 'orthopedics',
    city: 'Delhi',
    state: 'Delhi',
    experienceYears: 18,
    feeInr: 1500,
    rating: 4.6,
    reviewCount: 89,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationTypes: ['IN_CLINIC', 'ONLINE'],
    verified: true,
    bio: 'MS Orthopaedics. Sports injuries, joint pain, and post-surgery rehabilitation guidance.',
    clinicName: 'Capital Bone & Joint, Saket',
    nextSlot: 'Wed, 11:30 AM',
  },
  {
    id: 'doc_5',
    slug: 'meera-reddy',
    firstName: 'Meera',
    lastName: 'Reddy',
    specialty: 'Gynecology',
    specialtySlug: 'gynecology',
    city: 'Hyderabad',
    state: 'Telangana',
    experienceYears: 11,
    feeInr: 1100,
    rating: 4.9,
    reviewCount: 178,
    languages: ['English', 'Hindi', 'Telugu'],
    consultationTypes: ['IN_CLINIC', 'ONLINE'],
    verified: true,
    bio: 'MS OBG. Antenatal care, PCOS, and minimally invasive procedure counselling.',
    clinicName: 'CareWomen Hospital, Gachibowli',
    nextSlot: 'Today, 2:00 PM',
  },
  {
    id: 'doc_6',
    slug: 'arjun-kulkarni',
    firstName: 'Arjun',
    lastName: 'Kulkarni',
    specialty: 'General Physician',
    specialtySlug: 'general-physician',
    city: 'Pune',
    state: 'Maharashtra',
    experienceYears: 7,
    feeInr: 600,
    rating: 4.5,
    reviewCount: 64,
    languages: ['English', 'Hindi', 'Marathi'],
    consultationTypes: ['ONLINE'],
    verified: false,
    bio: 'MBBS. Teleconsultation for common illnesses and follow-ups. Verification pending.',
    clinicName: 'Online consult — Pune',
    nextSlot: 'Today, 8:00 PM',
  },
];

export const DEMO_PLANS: DemoPlan[] = [
  {
    code: 'trial',
    name: 'Free Trial',
    priceInr: 0,
    interval: 'month',
    description: '14 days to explore scheduling and patient list.',
    features: ['Up to 50 appointments', 'Basic calendar', 'Email reminders'],
  },
  {
    code: 'basic',
    name: 'Basic',
    priceInr: 999,
    interval: 'month',
    description: 'For solo practitioners starting digital practice.',
    features: ['200 appointments / mo', 'Prescriptions', 'Patient records', 'In-clinic booking'],
    highlighted: true,
  },
  {
    code: 'professional',
    name: 'Professional',
    priceInr: 2499,
    interval: 'month',
    description: 'Online consults and growth analytics.',
    features: ['Unlimited appointments', 'Video consultations', 'Analytics dashboard', 'Payment collection'],
  },
  {
    code: 'premium',
    name: 'Premium',
    priceInr: 4999,
    interval: 'month',
    description: 'Multi-clinic teams and branding.',
    features: ['Up to 5 staff accounts', '3 clinic branches', 'Custom branding', 'Priority support'],
  },
];

export const DEMO_PATIENT = {
  name: 'Rohan Kapoor',
  upcomingAppointments: [
    {
      id: 'apt_1',
      doctorName: 'Dr. Ananya Sharma',
      specialty: 'General Physician',
      when: 'Sat, 25 Oct · 10:30 AM',
      type: 'In-clinic' as const,
      clinic: 'Sharma Family Clinic, Andheri West',
      status: 'Confirmed',
    },
    {
      id: 'apt_2',
      doctorName: 'Dr. Rahul Mehta',
      specialty: 'Dermatology',
      when: 'Mon, 27 Oct · 6:00 PM',
      type: 'Online' as const,
      clinic: 'Video consult',
      status: 'Confirmed',
    },
  ],
  recentPrescriptions: [
    { id: 'rx_1', doctor: 'Dr. Ananya Sharma', date: '12 Oct 2025', medicines: 3 },
    { id: 'rx_2', doctor: 'Dr. Rahul Mehta', date: '28 Sep 2025', medicines: 2 },
  ],
};

export const DEMO_DOCTOR_DASHBOARD = {
  name: 'Dr. Ananya Sharma',
  todayCount: 8,
  completed: 3,
  revenueTodayInr: 6400,
  schedule: [
    { time: '10:00', patient: 'Rohan K.', type: 'In-clinic', status: 'Completed' },
    { time: '10:30', patient: 'Sneha M.', type: 'Online', status: 'Completed' },
    { time: '11:00', patient: 'Amit P.', type: 'In-clinic', status: 'In progress' },
    { time: '12:00', patient: 'Lunch break', type: '—', status: 'Break' },
    { time: '4:30', patient: 'Vivek S.', type: 'In-clinic', status: 'Upcoming' },
  ],
};

export function getDoctorBySlug(slug: string): DemoDoctor | undefined {
  return DEMO_DOCTORS.find((d) => d.slug === slug);
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
