import { prisma } from '../prisma';

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      event: {
        include: {
          addons: true,
        },
      },
      addons: true,
      tickets: true,
      promoCode: true,
    },
  });
}

export async function getOrderByStripeSession(sessionId: string) {
  return prisma.order.findFirst({
    where: { stripeSession: sessionId },
    include: {
      event: true,
      tickets: true,
      addons: true,
    },
  });
}

export async function updateOrderStatus(id: string, status: 'PENDING' | 'PAID' | 'REFUNDED' | 'CANCELED') {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}

