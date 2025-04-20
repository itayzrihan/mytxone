import { Message } from "ai";
import { InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  boolean,
  text,
} from "drizzle-orm/pg-core";

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const userRelations = relations(user, ({ many }) => ({
  chats: many(chat),
  reservations: many(reservation),
  memories: many(memories),
  apiKeys: many(apiKey),
}));

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  messages: json("messages").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
});

export type Chat = Omit<InferSelectModel<typeof chat>, "messages"> & {
  messages: Array<Message>;
};

export const chatRelations = relations(chat, ({ one }) => ({
  user: one(user, {
    fields: [chat.userId],
    references: [user.id],
  }),
}));

export const reservation = pgTable("Reservation", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  details: json("details").notNull(),
  hasCompletedPayment: boolean("hasCompletedPayment").notNull().default(false),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
});

export type Reservation = InferSelectModel<typeof reservation>;

export const reservationRelations = relations(reservation, ({ one }) => ({
  user: one(user, {
    fields: [reservation.userId],
    references: [user.id],
  }),
}));

export const memories = pgTable("Memory", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export type Memory = InferSelectModel<typeof memories>;

export const memoriesRelations = relations(memories, ({ one }) => ({
  user: one(user, {
    fields: [memories.userId],
    references: [user.id],
  }),
}));

export const apiKey = pgTable("apikey", { // Changed "ApiKey" to "apikey"
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  hashedKey: text("hashedKey").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  lastUsedAt: timestamp("lastUsedAt"),
  name: text("name"),
});

export type ApiKey = InferSelectModel<typeof apiKey>;

export const apiKeyRelations = relations(apiKey, ({ one }) => ({
  user: one(user, {
    fields: [apiKey.userId],
    references: [user.id],
  }),
}));
