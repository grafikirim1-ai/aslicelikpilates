import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const instructors = pgTable(
  "acp_instructors",
  {
    id: serial("id").primaryKey(),
    fullName: varchar("full_name", { length: 120 }).notNull(),
    role: varchar("role", { length: 80 }).notNull(),
    specialties: text("specialties").array().notNull(),
    bio: text("bio").notNull(),
    phone: varchar("phone", { length: 30 }).notNull(),
    email: varchar("email", { length: 160 }).notNull(),
    experienceYears: integer("experience_years").notNull().default(1),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("acp_instructors_email_idx").on(table.email),
  }),
);

export const packages = pgTable(
  "acp_packages",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 80 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description").notNull(),
    sessionsCount: integer("sessions_count").notNull(),
    durationDays: integer("duration_days").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    focus: varchar("focus", { length: 120 }).notNull(),
    includes: text("includes").array().notNull(),
    isPopular: boolean("is_popular").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("acp_packages_slug_idx").on(table.slug),
  }),
);

export const sessions = pgTable(
  "acp_sessions",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 80 }).notNull(),
    title: varchar("title", { length: 120 }).notNull(),
    sessionType: varchar("session_type", { length: 80 }).notNull(),
    level: varchar("level", { length: 40 }).notNull(),
    dayLabel: varchar("day_label", { length: 40 }).notNull(),
    weekday: integer("weekday").notNull(),
    startTime: varchar("start_time", { length: 5 }).notNull(),
    endTime: varchar("end_time", { length: 5 }).notNull(),
    durationMinutes: integer("duration_minutes").notNull().default(50),
    capacity: integer("capacity").notNull().default(8),
    location: varchar("location", { length: 120 }).notNull(),
    description: text("description").notNull(),
    instructorId: integer("instructor_id")
      .notNull()
      .references(() => instructors.id, { onDelete: "restrict" }),
    isFeatured: boolean("is_featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("acp_sessions_slug_idx").on(table.slug),
  }),
);

export const inquiries = pgTable("acp_inquiries", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  goal: varchar("goal", { length: 160 }).notNull(),
  preferredPackage: varchar("preferred_package", { length: 120 }),
  wantsWhatsapp: boolean("wants_whatsapp").notNull().default(true),
  message: text("message").notNull(),
  source: varchar("source", { length: 50 }).notNull().default("website"),
  status: varchar("status", { length: 40 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable("acp_notifications", {
  id: serial("id").primaryKey(),
  channel: varchar("channel", { length: 40 }).notNull(),
  recipient: varchar("recipient", { length: 160 }).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  message: text("message").notNull(),
  eventType: varchar("event_type", { length: 60 }).notNull(),
  status: varchar("status", { length: 40 }).notNull().default("queued"),
  relatedInquiryId: integer("related_inquiry_id").references(() => inquiries.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const gallery = pgTable("acp_gallery", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  category: varchar("category", { length: 80 }).notNull().default("Stüdyo"),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminUsers = pgTable("acp_admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 80 }).notNull().default("admin"),
  password: varchar("password", { length: 160 }).notNull().default("admin"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const instructorRelations = relations(instructors, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  instructor: one(instructors, {
    fields: [sessions.instructorId],
    references: [instructors.id],
  }),
}));

export const inquiryRelations = relations(inquiries, ({ many }) => ({
  notifications: many(notifications),
}));

export const notificationRelations = relations(notifications, ({ one }) => ({
  inquiry: one(inquiries, {
    fields: [notifications.relatedInquiryId],
    references: [inquiries.id],
  }),
}));
