import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

declare global {
  // Allow global `prisma` variable in development
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

// Configure the database connection using the Prisma v7 SQLite adapter
const getPrismaInstance = () => {
  const adapter = new PrismaBetterSqlite3({ url: 'file:dev.db' });
  return new PrismaClient({ adapter });
};

if (process.env.NODE_ENV === 'production') {
  prisma = getPrismaInstance();
} else {
  if (!global.prisma) {
    global.prisma = getPrismaInstance();
  }
  prisma = global.prisma;
}

export { prisma };
export default prisma;
