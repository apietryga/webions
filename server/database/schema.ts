import { int, text, timestamp, mysqlTable } from "drizzle-orm/mysql-core";

export const accounts = mysqlTable('accounts', {
  id: int('id').primaryKey().autoincrement(),
  login: text('login').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').notNull(),
})

