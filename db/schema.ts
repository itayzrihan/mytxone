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
  integer,
  decimal,
} from "drizzle-orm/pg-core";
import { protocols } from "./protocols-schema";

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
  role: varchar("role", { length: 20 }).notNull().default("user"), // 'user', 'admin'
  subscription: varchar("subscription", { length: 20 }).notNull().default("free"), // 'free', 'basic', 'pro'
  // 2FA / TOTP fields
  totpSecret: text("totp_secret"), // Encrypted TOTP secret
  totpEnabled: boolean("totp_enabled").notNull().default(false), // Is 2FA enabled
  totpSeedId: varchar("totp_seed_id", { length: 255 }), // Reference to seed ID from Legitate
  totpSetupCompleted: timestamp("totp_setup_completed"), // When 2FA was completed
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
  quoteTemplates: many(quoteTemplates),
  meetings: many(meeting),
  meetingAttendees: many(meetingAttendee),
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

export const scriptsRelations = relations(scripts, ({ one, many }) => ({
  user: one(user, {
    fields: [scripts.userId],
    references: [user.id],
  }),
  seriesLinks: many(scriptSeriesLinks),
}));

// Script Series (Folders)
export const scriptSeries = pgTable("ScriptSeries", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0), // for custom ordering of series
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
});

export type ScriptSeries = InferSelectModel<typeof scriptSeries>;

export const scriptSeriesRelations = relations(scriptSeries, ({ one, many }) => ({
  user: one(user, {
    fields: [scriptSeries.userId],
    references: [user.id],
  }),
  scriptLinks: many(scriptSeriesLinks),
}));

// Junction table for many-to-many relationship between scripts and series
export const scriptSeriesLinks = pgTable("ScriptSeriesLink", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  scriptId: uuid("script_id")
    .notNull()
    .references(() => scripts.id, { onDelete: "cascade" }),
  seriesId: uuid("series_id")
    .notNull()
    .references(() => scriptSeries.id, { onDelete: "cascade" }),
  orderInSeries: integer("order_in_series").notNull().default(0), // for custom ordering within a series
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export type ScriptSeriesLink = InferSelectModel<typeof scriptSeriesLinks>;

export const scriptSeriesLinksRelations = relations(scriptSeriesLinks, ({ one }) => ({
  script: one(scripts, {
    fields: [scriptSeriesLinks.scriptId],
    references: [scripts.id],
  }),
  series: one(scriptSeries, {
    fields: [scriptSeriesLinks.seriesId],
    references: [scriptSeries.id],
  }),
}));

// Prompts for AI interactions
export const prompts = pgTable("Prompt", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  description: text("description"),
  promptText: text("prompt_text").notNull(),
  category: text("category").notNull().default("general"), // general, writing, coding, analysis, creative, etc.
  tags: json("tags"), // array of strings for categorization
  isFavorite: boolean("is_favorite").notNull().default(false),
  isPublic: boolean("is_public").notNull().default(false),
  usageCount: integer("usage_count").notNull().default(0), // track how often prompt is used
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
});

export type Prompt = InferSelectModel<typeof prompts>;

export const promptsRelations = relations(prompts, ({ one }) => ({
  user: one(user, {
    fields: [prompts.userId],
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

// Quote System Tables
export const quoteTemplates = pgTable("QuoteTemplate", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  description: text("description"),
  businessType: text("business_type").notNull(), // "digital", "installation", "consulting", etc.
  isActive: boolean("is_active").notNull().default(true),
  allowGuestSubmissions: boolean("allow_guest_submissions").notNull().default(true),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
});

export type QuoteTemplate = InferSelectModel<typeof quoteTemplates>;

export const quoteTemplatesRelations = relations(quoteTemplates, ({ one, many }) => ({
  user: one(user, {
    fields: [quoteTemplates.userId],
    references: [user.id],
  }),
  items: many(quoteItems),
  responses: many(quoteResponses),
}));

export const quoteItems = pgTable("QuoteItem", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  templateId: uuid("template_id")
    .notNull()
    .references(() => quoteTemplates.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  isRequired: boolean("is_required").notNull().default(false),
  itemType: text("item_type").notNull(), // "fixed", "range", "parameter", "option_group"
  fixedPrice: decimal("fixed_price", { precision: 10, scale: 2 }),
  minPrice: decimal("min_price", { precision: 10, scale: 2 }),
  maxPrice: decimal("max_price", { precision: 10, scale: 2 }),
  parameterType: text("parameter_type"), // "video_length", "page_count", "custom"
  parameterUnit: text("parameter_unit"), // "seconds", "pages", "hours", etc.
  parameterPricingMode: text("parameter_pricing_mode"), // "fixed" or "range" - for parameter-based pricing
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }),
  minPricePerUnit: decimal("min_price_per_unit", { precision: 10, scale: 2 }), // For range pricing per unit
  maxPricePerUnit: decimal("max_price_per_unit", { precision: 10, scale: 2 }), // For range pricing per unit
  minUnits: integer("min_units"),
  maxUnits: integer("max_units"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export type QuoteItem = InferSelectModel<typeof quoteItems>;

export const quoteItemsRelations = relations(quoteItems, ({ one, many }) => ({
  template: one(quoteTemplates, {
    fields: [quoteItems.templateId],
    references: [quoteTemplates.id],
  }),
  options: many(quoteOptions),
}));

export const quoteOptions = pgTable("QuoteOption", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  itemId: uuid("item_id")
    .notNull()
    .references(() => quoteItems.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  pricingType: text("pricing_type").notNull().default('fixed'), // "fixed" or "range"
  fixedPrice: decimal("fixed_price", { precision: 10, scale: 2 }),
  minPrice: decimal("min_price", { precision: 10, scale: 2 }),
  maxPrice: decimal("max_price", { precision: 10, scale: 2 }),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export type QuoteOption = InferSelectModel<typeof quoteOptions>;

export const quoteOptionsRelations = relations(quoteOptions, ({ one }) => ({
  item: one(quoteItems, {
    fields: [quoteOptions.itemId],
    references: [quoteItems.id],
  }),
}));

export const quoteResponses = pgTable("QuoteResponse", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  templateId: uuid("template_id")
    .notNull()
    .references(() => quoteTemplates.id),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  selectedItems: json("selected_items").notNull(), // Array of selected item IDs with quantities/parameters
  selectedOptions: json("selected_options").notNull(), // Array of selected option IDs
  parameterValues: json("parameter_values"), // Object with parameter values for each item
  totalMinPrice: decimal("total_min_price", { precision: 10, scale: 2 }),
  totalMaxPrice: decimal("total_max_price", { precision: 10, scale: 2 }),
  notes: text("notes"),
  status: text("status").notNull().default("pending"), // "pending", "reviewed", "quoted", "closed"
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export type QuoteResponse = InferSelectModel<typeof quoteResponses>;

export const quoteResponsesRelations = relations(quoteResponses, ({ one }) => ({
  template: one(quoteTemplates, {
    fields: [quoteResponses.templateId],
    references: [quoteTemplates.id],
  }),
}));

// Registration tokens for 2FA setup tracking
export const registrationToken = pgTable("RegistrationToken", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }).notNull(),
  serviceName: varchar("service_name", { length: 255 }).notNull(),
  callbackUrl: text("callback_url"),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending', 'completed', 'rejected', 'expired'
  seedId: varchar("seed_id", { length: 255 }),
  totpSeed: text("totp_seed"), // Encrypted TOTP secret
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  completedAt: timestamp("completed_at"),
});

export type RegistrationToken = InferSelectModel<typeof registrationToken>;

export const registrationTokenRelations = relations(
  registrationToken,
  ({ one }) => ({
    user: one(user, {
      fields: [registrationToken.userId],
      references: [user.id],
    }),
  })
);

// Meeting System Tables
export const meeting = pgTable("Meeting", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  meetingType: text("meeting_type").notNull(), // "webinar", "consultation", "workshop", "demo", etc.
  imageUrl: text("image_url"), // Cover image for the meeting
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  timezone: text("timezone").notNull().default("UTC"),
  meetingUrl: text("meeting_url"), // Zoom/Meet link
  maxAttendees: integer("max_attendees"), // null for unlimited
  isPublic: boolean("is_public").notNull().default(true),
  requiresApproval: boolean("requires_approval").notNull().default(false),
  status: text("status").notNull().default("upcoming"), // "upcoming", "live", "completed", "cancelled"
  tags: json("tags"), // Array of strings for categorization
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
});

export type Meeting = InferSelectModel<typeof meeting>;

export const meetingRelations = relations(meeting, ({ one, many }) => ({
  user: one(user, {
    fields: [meeting.userId],
    references: [user.id],
  }),
  attendees: many(meetingAttendee),
}));

export const meetingAttendee = pgTable("MeetingAttendee", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  meetingId: uuid("meeting_id")
    .notNull()
    .references(() => meeting.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .references(() => user.id, { onDelete: "cascade" }), // null for guest attendees
  guestName: text("guest_name"), // For non-registered users
  guestEmail: text("guest_email"), // For non-registered users
  registrationStatus: text("registration_status").notNull().default("registered"), // "registered", "approved", "rejected", "cancelled"
  attendanceStatus: text("attendance_status").notNull().default("pending"), // "pending", "attended", "no-show"
  registeredAt: timestamp("registered_at")
    .notNull()
    .defaultNow(),
});

export type MeetingAttendee = InferSelectModel<typeof meetingAttendee>;

export const meetingAttendeeRelations = relations(meetingAttendee, ({ one }) => ({
  meeting: one(meeting, {
    fields: [meetingAttendee.meetingId],
    references: [meeting.id],
  }),
  user: one(user, {
    fields: [meetingAttendee.userId],
    references: [user.id],
  }),
}));
