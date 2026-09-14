import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const records = sqliteTable('records', {
  id: text('id').primaryKey(), owner: text('owner').notNull(), kind: text('kind').notNull(),
  zone: text('zone').notNull(), data: text('data').notNull(), createdAt: text('created_at').notNull(),
});
export const audits = sqliteTable('audits', {
  id: integer('id').primaryKey({autoIncrement:true}), owner: text('owner').notNull(),
  actor: text('actor').notNull(), action: text('action').notNull(), recordId: text('record_id').notNull(),
  detail: text('detail').notNull(), createdAt: text('created_at').notNull(),
});
