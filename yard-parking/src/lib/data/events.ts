import { DateTime } from 'luxon';
import { prisma } from '../prisma';

const BASE_EVENT_INCLUDE = {
  priceTiers: true,
  addons: true,
};

export async function getUpcomingEvents({ includeSoldOut = false } = {}) {
  const now = new Date();
  const events = await prisma.event.findMany({
    where: {
      dateTime: {
        gte: now,
      },
    },
    include: {
      ...BASE_EVENT_INCLUDE,
      orders: {
        where: {
          status: 'PAID',
        },
        select: {
          qty: true,
        },
      },
    },
    orderBy: {
      dateTime: 'asc',
    },
  });

  return events.filter((event) => {
    if (includeSoldOut) return true;
    const spotsTaken = event.orders.reduce((acc, order) => acc + order.qty, 0);
    return spotsTaken < event.capacity;
  });
}

export async function getEventBySlug(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
    include: BASE_EVENT_INCLUDE,
  });
}

export async function getEventAvailability(eventId: string) {
  const [event, paidOrders] = await Promise.all([
    prisma.event.findUnique({
      where: { id: eventId },
      select: { capacity: true },
    }),
    prisma.order.aggregate({
      where: { eventId, status: 'PAID' },
      _sum: { qty: true },
    }),
  ]);

  if (!event) {
    throw new Error('Event not found');
  }

  const sold = paidOrders._sum.qty ?? 0;
  return {
    capacity: event.capacity,
    sold,
    available: Math.max(0, event.capacity - sold),
  };
}

export async function getSiteSetting() {
  return prisma.siteSetting.findUnique({ where: { id: 1 } });
}

export async function getCalendarEvents() {
  const events = await getUpcomingEvents({ includeSoldOut: true });

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    date: DateTime.fromJSDate(event.dateTime).toISODate(),
    slug: event.slug,
  }));
}

