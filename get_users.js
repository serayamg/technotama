const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const bcrypt = require('bcryptjs');

const adapter = new PrismaBetterSqlite3({ url: 'file:dev.db' });
const prisma = new PrismaClient({ adapter });

const commonPasswords = [
  'admin', 'admin123', 'password', 'password123', '123456', '12345678', 'technotama', 'rti123', 'adminrti',
  'adminadmin', 'bankdki', 'bankdki123', 'dki123', 'client', 'client123', 'customercare', 'customer123',
  'rtineo', 'rti-neo', 'rtineo123', 'rtineo2026', 'technotama123', 'risetin', 'risetin123'
];

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    console.log(`User: ${user.name} <${user.email}>`);
    
    let found = false;
    for (const pass of commonPasswords) {
      if (await bcrypt.compare(pass, user.password)) {
        console.log(`-> PASSWORD FOUND: "${pass}"`);
        found = true;
        break;
      }
    }
    if (!found) {
      console.log(`-> Password is NOT in this extended list.`);
    }
    console.log('---');
  }
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
