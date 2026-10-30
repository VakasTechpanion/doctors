'use client';

import {
  DemoDoctorSubscription,
  DemoPaymentRecord,
  generateReceiptNumber,
  calcPlatformFee,
  calcDoctorNet,
} from './demo-payments';

const SUB_KEY = 'mediconnect_demo_subscription';
const PAYMENTS_KEY = 'mediconnect_demo_payments';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getDemoSubscription(): DemoDoctorSubscription | null {
  return readJson<DemoDoctorSubscription | null>(SUB_KEY, null);
}

export function setDemoSubscription(sub: DemoDoctorSubscription): void {
  writeJson(SUB_KEY, sub);
}

export function clearDemoSubscription(): void {
  localStorage.removeItem(SUB_KEY);
}

export function getDemoUserPayments(): DemoPaymentRecord[] {
  return readJson<DemoPaymentRecord[]>(PAYMENTS_KEY, []);
}

export function addDemoPayment(record: DemoPaymentRecord): void {
  const list = getDemoUserPayments();
  list.unshift(record);
  writeJson(PAYMENTS_KEY, list.slice(0, 50));
}

export function subscribeToPlan(planCode: string, priceInr: number): DemoDoctorSubscription {
  const now = new Date();
  const isTrial = planCode === 'trial' || priceInr === 0;
  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + 14);

  const sub: DemoDoctorSubscription = {
    planCode,
    status: isTrial ? 'trialing' : 'active',
    startedAt: now.toISOString(),
    trialEndsAt: isTrial ? trialEnd.toISOString() : undefined,
    nextBillingDate: isTrial
      ? trialEnd.toISOString()
      : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString(),
  };
  setDemoSubscription(sub);

  if (priceInr > 0) {
    addDemoPayment({
      id: `pay_${Date.now()}`,
      purpose: 'SUBSCRIPTION',
      status: 'CAPTURED',
      amountInr: priceInr,
      platformFeeInr: 0,
      description: `${planCode} plan — first payment (demo)`,
      paidAt: now.toISOString(),
      receiptNumber: generateReceiptNumber('INV'),
      planCode,
    });
  }

  return sub;
}

export function payForAppointment(input: {
  doctorSlug: string;
  doctorName: string;
  feeInr: number;
  slotLabel: string;
  type: 'In-clinic' | 'Online';
}): DemoPaymentRecord {
  const now = new Date();
  const platformFeeInr = calcPlatformFee(input.feeInr);
  const record: DemoPaymentRecord = {
    id: `pay_${Date.now()}`,
    purpose: 'APPOINTMENT',
    status: 'CAPTURED',
    amountInr: input.feeInr,
    platformFeeInr,
    netToDoctorInr: calcDoctorNet(input.feeInr),
    description: `${input.type} · ${input.doctorName} · ${input.slotLabel}`,
    paidAt: now.toISOString(),
    receiptNumber: generateReceiptNumber('RCP'),
    doctorSlug: input.doctorSlug,
  };
  addDemoPayment(record);
  return record;
}
