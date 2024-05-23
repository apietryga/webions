import { drizzle } from 'drizzle-orm/d1'
export { sql, eq, and, or } from 'drizzle-orm'

import * as schema from '../database/schema'

export const tables = schema

export function useDrizzle() {
    // @ts-ignore
    return drizzle(hubDatabase(), { schema })
}

export type Account = typeof schema.accounts.$inferSelect