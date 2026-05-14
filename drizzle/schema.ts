import { pgTable, serial, varchar, date, timestamp, boolean, jsonb, integer, text, decimal } from 'drizzle-orm/pg-core';

// 用户表
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  phone: varchar('phone', { length: 20 }).unique().notNull(),
  nickname: varchar('nickname', { length: 50 }),
  avatar: varchar('avatar', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// 用户档案表
export const user_profiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  name: varchar('name', { length: 50 }).notNull(),
  birth_date: date('birth_date').notNull(),
  gender: varchar('gender', { length: 10 }).notNull(),
  location: varchar('location', { length: 100 }).notNull(),
  is_default: boolean('is_default').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// 水晶库表
export const crystals = pgTable('crystals', {
  id: serial('id').primaryKey(),
  crystal_id: varchar('crystal_id', { length: 20 }).unique().notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  color: varchar('color', { length: 100 }).notNull(),
  elements: jsonb('elements').notNull(),
  effects: jsonb('effects').notNull(),
  price_level: varchar('price_level', { length: 10 }).notNull(),
  bead_sizes: jsonb('bead_sizes').notNull(),
  image_url: varchar('image_url', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// 能量解析报告表
export const energy_reports = pgTable('energy_reports', {
  id: serial('id').primaryKey(),
  report_id: varchar('report_id', { length: 50 }).unique().notNull(),
  user_id: integer('user_id').references(() => users.id),
  profile_id: integer('profile_id').references(() => user_profiles.id),
  scene: varchar('scene', { length: 50 }).notNull(),
  body_strength: varchar('body_strength', { length: 10 }).notNull(),
  favorable_elements: jsonb('favorable_elements').notNull(),
  missing_elements: jsonb('missing_elements').notNull(),
  radar_chart_data: jsonb('radar_chart_data'),
  summary_text: text('summary_text'),
  logic_chain: jsonb('logic_chain'),
  created_at: timestamp('created_at').defaultNow(),
});

// 定制方案表
export const recommendations = pgTable('recommendations', {
  id: serial('id').primaryKey(),
  report_id: varchar('report_id', { length: 50 }).references(() => energy_reports.report_id),
  price_tier: varchar('price_tier', { length: 20 }).notNull(),
  crystals: jsonb('crystals').notNull(),
  total_price: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  image_url: varchar('image_url', { length: 255 }),
  description: text('description'),
  reason_summary: text('reason_summary'),
  created_at: timestamp('created_at').defaultNow(),
});

// 订单表
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  order_id: varchar('order_id', { length: 50 }).unique().notNull(),
  user_id: integer('user_id').references(() => users.id),
  profile_id: integer('profile_id').references(() => user_profiles.id),
  recommendation_id: integer('recommendation_id').references(() => recommendations.id),
  price_tier: varchar('price_tier', { length: 20 }).notNull(),
  total_price: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  address: jsonb('address').notNull(),
  contact_info: jsonb('contact_info').notNull(),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
