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
import { protocols } from "./protocols-schema";

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
  role: varchar("role", { length: 20 }).notNull().default("user"), // 'user', 'admin'
  subscription: varchar("subscription", { length: 20 }).notNull().default("free"), // 'free', 'basic', 'pro'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = InferSelectModel<typeof user>;

export const userRelations = relations(user, ({ many }) => ({
  chats: many(chat),
  reservations: many(reservation),
  memories: many(memories),
  apiKeys: many(apiKey),
  tasks: many(tasks),
  meditations: many(meditations),
  protocols: many(protocols),
  scripts: many(scripts),
  customHooks: many(customHooks),
  customContentTypes: many(customContentTypes),
  userFavorites: many(userFavorites),
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

export const tasks = pgTable("Task", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export type Task = InferSelectModel<typeof tasks>;

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(user, {
    fields: [tasks.userId],
    references: [user.id],
  }),
}));

export const meditations = pgTable("Meditation", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  type: text("type").notNull(), // e.g., "visualization", "mindfulness", etc.
  title: text("title").notNull(),
  content: text("content").notNull(),
  duration: text("duration"), // e.g., "5 minutes", "10 minutes"
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export type Meditation = InferSelectModel<typeof meditations>;

export const meditationsRelations = relations(meditations, ({ one }) => ({
  user: one(user, {
    fields: [meditations.userId],
    references: [user.id],
  }),
}));

export const apiKey = pgTable("apikey", {
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

export const scripts = pgTable("Script", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  language: text("language").notNull().default("english"), // spoken language for video script
  hookType: text("hook_type").notNull(), // type of hook used
  mainContentType: text("main_content_type").notNull().default("storytelling"), // main content type
  contentFolderLink: text("content_folder_link"), // link to folder with editing content
  productionVideoLink: text("production_video_link"), // link to production ready video
  uploadedVideoLinks: json("uploaded_video_links"), // array of links to uploaded videos
  status: text("status").notNull().default("in-progress"), // in-progress or ready
  tags: json("tags"), // array of strings for categorization
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
});

export type Script = InferSelectModel<typeof scripts>;

export const scriptsRelations = relations(scripts, ({ one }) => ({
  user: one(user, {
    fields: [scripts.userId],
    references: [user.id],
  }),
}));

export const customHooks = pgTable("CustomHook", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  value: text("value").notNull(), // URL-friendly identifier
  label: text("label").notNull(), // Human-readable name
  description: text("description").notNull(),
  example: text("example").notNull(),
  structure: text("structure").notNull(),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
});

export type CustomHook = InferSelectModel<typeof customHooks>;

export const customHooksRelations = relations(customHooks, ({ one }) => ({
  user: one(user, {
    fields: [customHooks.userId],
    references: [user.id],
  }),
}));

export const customContentTypes = pgTable("CustomContentType", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  value: text("value").notNull(), // URL-friendly identifier
  label: text("label").notNull(), // Human-readable name
  description: text("description").notNull(),
  example: text("example").notNull(),
  structure: text("structure").notNull(),
  category: text("category").notNull(),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
});

export type CustomContentType = InferSelectModel<typeof customContentTypes>;

export const customContentTypesRelations = relations(customContentTypes, ({ one }) => ({
  user: one(user, {
    fields: [customContentTypes.userId],
    references: [user.id],
  }),
}));

export const userFavorites = pgTable("UserFavorites", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  favoriteType: varchar("favorite_type", { length: 20 }).notNull(), // 'content_type' or 'hook'
  favoriteId: varchar("favorite_id", { length: 100 }).notNull(), // The value/id of the content type or hook
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export type UserFavorite = InferSelectModel<typeof userFavorites>;

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(user, {
    fields: [userFavorites.userId],
    references: [user.id],
  }),
}));
