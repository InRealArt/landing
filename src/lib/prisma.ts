import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL as string }),
        log: [/*'query', */'info', 'warn', 'error'],
    })

// Singleton aussi en production : le proxy (src/lib/slugIndex.ts) et les pages partagent le même pool de connexions
globalForPrisma.prisma = prisma
