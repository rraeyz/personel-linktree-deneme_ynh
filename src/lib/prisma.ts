import 'dotenv/config'
import { PrismaClient } from '../../generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma 7: Better-SQLite3 adapter kullanımı
const connectionString = process.env.DATABASE_URL || 'file:./prisma/dev.db'
const dbPath = connectionString.replace('file:', '')
const db = new Database(dbPath)
const adapter = new PrismaBetterSqlite3({ url: connectionString })

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
