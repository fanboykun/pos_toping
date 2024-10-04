import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import { MODE, TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "$env/static/private";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const E = {
  mode: import.meta.env,
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
} as const

const getPrismaInstance = () => {
  // if(MODE === "development") return new PrismaClient()

  const libsql = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  })
  const adapter = new PrismaLibSQL(libsql)
  return new PrismaClient({ adapter })

}
export const prisma = getPrismaInstance()