import { PrismaClient, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();

const DEFAULT_TIMEZONE = 'America/New_York';

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'owner@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme123!';

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {
      timezone: DEFAULT_TIMEZONE,
      contactEmail: adminEmail,
      contactPhone: '(813) 555-0123',
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.372640989237!2d-82.50610502382163!3d27.976212169133447',
    },
    create: {
      timezone: DEFAULT_TIMEZONE,
      contactEmail: adminEmail,
      contactPhone: '(813) 555-0123',
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.372640989237!2d-82.50610502382163!3d27.976212169133447',
    },
  });

  await prisma.event.deleteMany();
  await prisma.promoCode.deleteMany();

  const baseDate = DateTime.now().setZone(DEFAULT_TIMEZONE);

  const events = [
    {
      slug: 'football-game-home',
      title: 'Football Game – Home',
      description:
        'Reserve a private yard parking spot for the big home game. Quick walk, easy exit.',
      dateTime: baseDate.plus({ days: 3 }).set({ hour: 19, minute: 30 }).toJSDate(),
      gatesOpenAt: baseDate.plus({ days: 3 }).set({ hour: 17, minute: 30 }).toJSDate(),
      cutoffHours: 3,
      capacity: 18,
      basePrice: 3500,
      serviceFeePct: 0.06,
      taxPct: 0,
      addonsEnabled: true,
      priceTiers: [
        {
          name: 'Early Bird',
          startsAt: baseDate.minus({ days: 14 }).toJSDate(),
          endsAt: baseDate.plus({ days: 3 }).minus({ hours: 72 }).toJSDate(),
          price: 3000,
        },
      ],
      addons: [
        { name: 'Oversized Vehicle', description: 'For trucks, vans, or RVs.', price: 1000 },
        {
          name: 'Early Arrival Window',
          description: 'Arrive up to 2 hours before gates open.',
          price: 700,
        },
        { name: 'Tailgate Pass', description: 'Includes grill set-up area.', price: 1200 },
      ],
    },
    {
      slug: 'concert-night',
      title: 'Concert Night',
      description:
        'Skip the garages and park in a friendly yard that puts you minutes from your seats.',
      dateTime: baseDate.plus({ days: 9 }).set({ hour: 20, minute: 0 }).toJSDate(),
      gatesOpenAt: baseDate.plus({ days: 9 }).set({ hour: 18, minute: 30 }).toJSDate(),
      cutoffHours: 2,
      capacity: 14,
      basePrice: 4000,
      serviceFeePct: 0.05,
      taxPct: 0.075,
      addonsEnabled: true,
      priceTiers: [],
      addons: [
        { name: 'Oversized Vehicle', description: 'Extended wheelbase.', price: 1200 },
        { name: 'Tailgate Pass', description: 'Bring chairs and coolers.', price: 900 },
      ],
    },
    {
      slug: 'bowl-game',
      title: 'Bowl Game',
      description:
        'Reserve parking for the biggest game of the season. Perfect for tailgates and group arrivals.',
      dateTime: DateTime.fromISO(`${baseDate.year + 1}-01-01T13:00:00`, {
        zone: DEFAULT_TIMEZONE,
      }).toJSDate(),
      gatesOpenAt: DateTime.fromISO(`${baseDate.year + 1}-01-01T10:30:00`, {
        zone: DEFAULT_TIMEZONE,
      }).toJSDate(),
      cutoffHours: 4,
      capacity: 22,
      basePrice: 5000,
      serviceFeePct: 0.06,
      taxPct: 0.075,
      addonsEnabled: true,
      priceTiers: [
        {
          name: 'Early Bird',
          startsAt: baseDate.minus({ days: 30 }).toJSDate(),
          endsAt: DateTime.fromISO(`${baseDate.year + 1}-01-01T04:00:00`, {
            zone: DEFAULT_TIMEZONE,
          }).toJSDate(),
          price: 4500,
        },
        {
          name: 'Last Minute',
          startsAt: DateTime.fromISO(`${baseDate.year + 1}-01-01T08:00:00`, {
            zone: DEFAULT_TIMEZONE,
          }).toJSDate(),
          endsAt: DateTime.fromISO(`${baseDate.year + 1}-01-01T12:00:00`, {
            zone: DEFAULT_TIMEZONE,
          }).toJSDate(),
          price: 5500,
        },
      ],
      addons: [
        { name: 'Oversized Vehicle', description: 'Lifted trucks or sprinter vans.', price: 1500 },
        {
          name: 'Early Arrival Window',
          description: 'Arrive up to 3 hours before gates open.',
          price: 1200,
        },
        { name: 'Tailgate Pass', description: 'Space for grills and tents.', price: 1500 },
      ],
    },
  ];

  for (const data of events) {
    await prisma.event.create({
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        dateTime: data.dateTime,
        gatesOpenAt: data.gatesOpenAt,
        cutoffHours: data.cutoffHours,
        capacity: data.capacity,
        basePrice: data.basePrice,
        serviceFeePct: data.serviceFeePct,
        taxPct: data.taxPct,
        addonsEnabled: data.addonsEnabled,
        priceTiers: {
          create: data.priceTiers,
        },
        addons: {
          create: data.addons,
        },
      },
    });
  }

  await prisma.promoCode.createMany({
    data: [
      {
        code: 'EARLYBIRD10',
        percent: 0.1,
        maxUses: 30,
        startsAt: baseDate.minus({ days: 7 }).toJSDate(),
        endsAt: baseDate.plus({ days: 7 }).toJSDate(),
      },
      {
        code: 'GROUPFIVE',
        amountOff: 1500,
        maxUses: 10,
        startsAt: baseDate.minus({ days: 1 }).toJSDate(),
        endsAt: baseDate.plus({ days: 30 }).toJSDate(),
      },
    ],
  });

  console.log('Seed data created successfully.');
}

main()
  .catch((error) => {
    console.error('Error seeding database', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

