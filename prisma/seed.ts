/* eslint-disable no-console */
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const authId = '86f41bd0-a011-45a2-837d-36ff38f6e8da';

  await prisma.user.create({
    data: {
      authId,
      name: 'Root',
      roles: [UserRole.root, UserRole.admin, UserRole.user],
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
