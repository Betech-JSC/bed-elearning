import prisma from "./prisma";

/**
 * Calculates the balance and revenue for an instructor.
 * @param instructorId The ID of the instructor
 * @returns An object containing total revenue, total paid out, total pending, and available balance.
 */
export async function getInstructorBalance(instructorId: string) {
  // Get global settings for platform fee
  const settings = await prisma.globalSettings.findUnique({
    where: { id: "global" },
  });

  const platformFeePercentage = settings?.platformFee ?? 30; // Default 30%
  const instructorShareMultiplier = (100 - platformFeePercentage) / 100;

  // Get all PAID orders for this instructor's courses
  const paidOrderItems = await prisma.orderItem.findMany({
    where: {
      order: { status: "PAID" },
      course: { instructorId: instructorId },
    },
    select: {
      price: true,
    },
  });

  const totalRevenue = paidOrderItems.reduce(
    (acc, item) => acc + item.price * instructorShareMultiplier,
    0
  );

  // Get payout history
  const payouts = await prisma.payout.findMany({
    where: { instructorId: instructorId },
  });

  const totalPaidOut = payouts
    .filter((p) => p.status === "PAID")
    .reduce((acc, p) => acc + p.amount, 0);

  const totalPending = payouts
    .filter((p) => p.status === "PENDING" || p.status === "PROCESSING")
    .reduce((acc, p) => acc + p.amount, 0);

  const availableBalance = totalRevenue - totalPaidOut - totalPending;

  return {
    totalRevenue,
    totalPaidOut,
    totalPending,
    availableBalance,
    platformFeePercentage,
  };
}
