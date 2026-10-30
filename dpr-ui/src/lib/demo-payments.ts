/** Demo payment & monetization models — replace with Razorpay + API later. */

import { DEMO_PLANS, formatInr } from './demo-data';

export const DEMO_PLATFORM_COMMISSION_BPS = 500; // 5%

export type PaymentPurpose = 'SUBSCRIPTION' | 'APPOINTMENT';

export type DemoPaymentRecord = {
  id: string;
  purpose: PaymentPurpose;
  status: 'CAPTURED' | 'REFUNDED';
  amountInr: number;
  platformFeeInr: number;
  netToDoctorInr?: number;
  description: string;
  paidAt: string;
  receiptNumber: string;
  planCode?: string;
  doctorSlug?: string;
};

export type DemoDoctorSubscription = {
  planCode: string;
  status: 'trialing' | 'active' | 'cancelled';
  startedAt: string;
  trialEndsAt?: string;
  nextBillingDate?: string;
};

export const DEMO_BILLING_HISTORY: DemoPaymentRecord[] = [
  {
    id: 'pay_demo_1',
    purpose: 'SUBSCRIPTION',
    status: 'CAPTURED',
    amountInr: 999,
    platformFeeInr: 0,
    description: 'Basic plan — October 2025',
    paidAt: '2025-10-01T09:00:00.000Z',
    receiptNumber: 'INV-2025-1001',
    planCode: 'basic',
  },
  {
    id: 'pay_demo_2',
    purpose: 'APPOINTMENT',
    status: 'CAPTURED',
    amountInr: 800,
    platformFeeInr: 40,
    netToDoctorInr: 760,
    description: 'Consultation — Rohan Kapoor',
    paidAt: '2025-10-12T11:30:00.000Z',
    receiptNumber: 'RCP-2025-8812',
    doctorSlug: 'ananya-sharma',
  },
  {
    id: 'pay_demo_3',
    purpose: 'APPOINTMENT',
    status: 'CAPTURED',
    amountInr: 1200,
    platformFeeInr: 60,
    netToDoctorInr: 1140,
    description: 'Online consult — Sneha M.',
    paidAt: '2025-10-18T16:00:00.000Z',
    receiptNumber: 'RCP-2025-9018',
    doctorSlug: 'ananya-sharma',
  },
];

export function calcPlatformFee(amountInr: number): number {
  return Math.round((amountInr * DEMO_PLATFORM_COMMISSION_BPS) / 10000);
}

export function calcDoctorNet(consultationFeeInr: number): number {
  return consultationFeeInr - calcPlatformFee(consultationFeeInr);
}

export function getPlanByCode(code: string) {
  return DEMO_PLANS.find((p) => p.code === code);
}

export function formatReceiptLine(record: DemoPaymentRecord): string {
  return `${record.receiptNumber} · ${formatInr(record.amountInr)} · ${new Date(record.paidAt).toLocaleDateString('en-IN')}`;
}

export function generateReceiptNumber(prefix: 'INV' | 'RCP'): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-2025-${n}`;
}
