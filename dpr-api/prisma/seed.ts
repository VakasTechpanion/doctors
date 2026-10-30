import { PrismaClient, RoleCode, BillingInterval, SubscriberType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MediConnect development data…');

  const roles: { code: RoleCode; name: string; description: string }[] = [
    { code: RoleCode.PATIENT, name: 'Patient', description: 'Healthcare consumer' },
    { code: RoleCode.DOCTOR, name: 'Doctor', description: 'Licensed healthcare provider' },
    { code: RoleCode.CLINIC_OWNER, name: 'Clinic Owner', description: 'Clinic administrator' },
    { code: RoleCode.CLINIC_STAFF, name: 'Clinic Staff', description: 'Reception and operations' },
    { code: RoleCode.PLATFORM_ADMIN, name: 'Platform Admin', description: 'MediConnect operations' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      create: role,
      update: { name: role.name, description: role.description },
    });
  }

  const specialties = [
    { name: 'General Physician', slug: 'general-physician' },
    { name: 'Dermatology', slug: 'dermatology' },
    { name: 'Pediatrics', slug: 'pediatrics' },
    { name: 'Orthopedics', slug: 'orthopedics' },
    { name: 'Gynecology', slug: 'gynecology' },
  ];

  for (const s of specialties) {
    await prisma.specialty.upsert({
      where: { slug: s.slug },
      create: s,
      update: { name: s.name },
    });
  }

  const doctorPlans = [
    {
      code: 'doctor_trial',
      name: 'Free Trial',
      description: '14-day trial for new doctors',
      pricePaise: 0,
      billingInterval: BillingInterval.MONTHLY,
      trialDays: 14,
      subscriberType: SubscriberType.DOCTOR,
      entitlements: [
        { featureKey: 'appointments', limitValue: 50 },
        { featureKey: 'online_consultations', limitValue: 0 },
        { featureKey: 'staff_accounts', limitValue: 0 },
      ],
    },
    {
      code: 'doctor_basic',
      name: 'Basic',
      description: 'Essential scheduling and patient list',
      pricePaise: 99900,
      billingInterval: BillingInterval.MONTHLY,
      trialDays: 0,
      subscriberType: SubscriberType.DOCTOR,
      entitlements: [
        { featureKey: 'appointments', limitValue: 200 },
        { featureKey: 'prescriptions', limitValue: null },
        { featureKey: 'online_consultations', limitValue: 0 },
      ],
    },
    {
      code: 'doctor_professional',
      name: 'Professional',
      description: 'Online consults and analytics',
      pricePaise: 249900,
      billingInterval: BillingInterval.MONTHLY,
      trialDays: 0,
      subscriberType: SubscriberType.DOCTOR,
      entitlements: [
        { featureKey: 'appointments', limitValue: null },
        { featureKey: 'online_consultations', limitValue: null },
        { featureKey: 'analytics', limitValue: null },
      ],
    },
    {
      code: 'doctor_premium',
      name: 'Premium',
      description: 'Multi-clinic, staff, branding',
      pricePaise: 499900,
      billingInterval: BillingInterval.MONTHLY,
      trialDays: 0,
      subscriberType: SubscriberType.DOCTOR,
      entitlements: [
        { featureKey: 'appointments', limitValue: null },
        { featureKey: 'online_consultations', limitValue: null },
        { featureKey: 'staff_accounts', limitValue: 5 },
        { featureKey: 'multiple_clinics', limitValue: 3 },
        { featureKey: 'custom_branding', limitValue: null },
      ],
    },
  ];

  for (const plan of doctorPlans) {
    const { entitlements, ...planData } = plan;
    const created = await prisma.subscriptionPlan.upsert({
      where: { code: plan.code },
      create: planData,
      update: {
        name: plan.name,
        description: plan.description,
        pricePaise: plan.pricePaise,
        billingInterval: plan.billingInterval,
        trialDays: plan.trialDays,
      },
    });

    for (const ent of entitlements) {
      await prisma.planEntitlement.upsert({
        where: {
          planId_featureKey: { planId: created.id, featureKey: ent.featureKey },
        },
        create: { planId: created.id, ...ent },
        update: { limitValue: ent.limitValue },
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
