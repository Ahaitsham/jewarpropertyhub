/* eslint-disable no-console */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'ahtshamsaifi345@gmail.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const name = process.env.SEED_ADMIN_NAME || 'Ahaitsham Khan';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`User already exists for ${email}, skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, passwordHash, role: 'SUPER_ADMIN' },
  });

  console.log(`Created super admin: ${email}`);
  console.log('IMPORTANT: log in and change this password immediately.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
