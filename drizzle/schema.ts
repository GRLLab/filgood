import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Core user table backing the optional Manus auth flow. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const workshopReservations = mysqlTable("workshopReservations", {
  id: int("id").autoincrement().primaryKey(),
  workshopId: varchar("workshopId", { length: 64 }).notNull(),
  workshopTitle: varchar("workshopTitle", { length: 120 }).notNull(),
  workshopDate: varchar("workshopDate", { length: 120 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  places: int("places").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WorkshopReservation = typeof workshopReservations.$inferSelect;
export type InsertWorkshopReservation = typeof workshopReservations.$inferInsert;
