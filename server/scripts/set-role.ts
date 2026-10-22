/**
 * Promote or demote a user: npm run user:set-role -- <email> <USER|ADMIN>
 * (There is intentionally no API for this.)
 */
import { PrismaClient, Role } from '@prisma/client';

const [email, role] = process.argv.slice(2);
if (!email || !role || !(role in Role)) {
  console.error('Usage: npm run user:set-role -- <email> <USER|ADMIN>');
  process.exit(1);
}

const prisma = new PrismaClient();
try {
  const user = await prisma.user.update({
    where: { email: email.toLowerCase() },
    data: { role: role as Role },
    select: { email: true, role: true },
  });
  console.log(`${user.email} is now ${user.role}`);
} catch {
  console.error(`No user with email ${email}`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
