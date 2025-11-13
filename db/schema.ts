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
  subscription: varchar("subscription", { length: 20 }).notNull().default("free"), // 'free', 'basic', 'pro' (cached from PayPal)
  paypalSubscriptionId: varchar("paypal_subscription_id", { length: 255 }), // PayPal subscription ID (e.g., I-WTSU02NUPY7M)
  // Profile information
  fullName: varchar("full_name", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  notMytxEmail: varchar("not_mytx_email", { length: 255 }), // User's external email
  profileImageUrl: text("profile_image_url"), // URL to user's profile image
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
  communities: many(community),
  communityMemberships: many(communityMember),
  communityPosts: many(communityPost),
  communityComments: many(communityComment),
  communityPostReactions: many(communityPostReaction),
  communityCommentReactions: many(communityCommentReaction),
  communityCourses: many(communityCourse),
  communityCourseEnrollments: many(communityCourseEnrollment),
  communityEventsHosted: many(communityEvent),
  communityEventAttendances: many(communityEventAttendee),
  communityLeaderboardEntries: many(communityLeaderboard),
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

// Meeting System Tables
export const meeting = pgTable("Meeting", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  meetingType: text("meeting_type").notNull(), // "webinar", "consultation", "workshop", "demo", etc.
  category: text("category").notNull().default("business"), // "business", "technology", "health", etc.
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

// Community System Tables
export const community = pgTable("Community", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  communityType: text("community_type").notNull(), // "learning", "networking", "support", "hobby", etc.
  category: text("category").notNull().default("business"), // "business", "technology", "health", etc.
  imageUrl: text("image_url"), // Cover image for the community
  memberCount: integer("member_count").notNull().default(0),
  isPublic: boolean("is_public").notNull().default(true),
  requiresApproval: boolean("requires_approval").notNull().default(false),
  status: text("status").notNull().default("active"), // "active", "inactive", "archived"
  tags: json("tags"), // Array of strings for categorization
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
});

export type Community = InferSelectModel<typeof community>;

export const communityRelations = relations(community, ({ one, many }) => ({
  user: one(user, {
    fields: [community.userId],
    references: [user.id],
  }),
  members: many(communityMember),
  posts: many(communityPost),
  courses: many(communityCourse),
  events: many(communityEvent),
  leaderboard: many(communityLeaderboard),
}));

export const communityMember = pgTable("CommunityMember", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  communityId: uuid("community_id")
    .notNull()
    .references(() => community.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .references(() => user.id, { onDelete: "cascade" }), // null for guest members
  guestName: text("guest_name"), // For non-registered users
  guestEmail: text("guest_email"), // For non-registered users
  membershipStatus: text("membership_status").notNull().default("member"), // "member", "approved", "rejected", "left"
  role: text("role").notNull().default("member"), // "member", "moderator", "admin"
  joinedAt: timestamp("joined_at")
    .notNull()
    .defaultNow(),
});

export type CommunityMember = InferSelectModel<typeof communityMember>;

export const communityMemberRelations = relations(communityMember, ({ one }) => ({
  community: one(community, {
    fields: [communityMember.communityId],
    references: [community.id],
  }),
  user: one(user, {
    fields: [communityMember.userId],
    references: [user.id],
  }),
}));

// Community Posts System
export const communityPost = pgTable("CommunityPost", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  communityId: uuid("community_id")
    .notNull()
    .references(() => community.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  mediaUrls: json("media_urls"), // Array of media URLs (images, videos)
  mediaTypes: json("media_types"), // Array of media types (image, video)
  likeCount: integer("like_count").notNull().default(0),
  commentCount: integer("comment_count").notNull().default(0),
  shareCount: integer("share_count").notNull().default(0),
  isPinned: boolean("is_pinned").notNull().default(false),
  isEdited: boolean("is_edited").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type CommunityPost = InferSelectModel<typeof communityPost>;

export const communityPostRelations = relations(communityPost, ({ one, many }) => ({
  community: one(community, {
    fields: [communityPost.communityId],
    references: [community.id],
  }),
  user: one(user, {
    fields: [communityPost.userId],
    references: [user.id],
  }),
  comments: many(communityComment),
  reactions: many(communityPostReaction),
}));

// Community Post Comments
export const communityComment = pgTable("CommunityComment", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => communityPost.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  likeCount: integer("like_count").notNull().default(0),
  parentCommentId: uuid("parent_comment_id"), // For nested replies
  isEdited: boolean("is_edited").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type CommunityComment = InferSelectModel<typeof communityComment>;

export const communityCommentRelations = relations(communityComment, ({ one, many }) => ({
  post: one(communityPost, {
    fields: [communityComment.postId],
    references: [communityPost.id],
  }),
  user: one(user, {
    fields: [communityComment.userId],
    references: [user.id],
  }),
  parentComment: one(communityComment, {
    fields: [communityComment.parentCommentId],
    references: [communityComment.id],
  }),
  replies: many(communityComment),
  reactions: many(communityCommentReaction),
}));

// Post Reactions
export const communityPostReaction = pgTable("CommunityPostReaction", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => communityPost.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  reactionType: text("reaction_type").notNull(), // "like", "love", "celebrate", etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type CommunityPostReaction = InferSelectModel<typeof communityPostReaction>;

export const communityPostReactionRelations = relations(communityPostReaction, ({ one }) => ({
  post: one(communityPost, {
    fields: [communityPostReaction.postId],
    references: [communityPost.id],
  }),
  user: one(user, {
    fields: [communityPostReaction.userId],
    references: [user.id],
  }),
}));

// Comment Reactions
export const communityCommentReaction = pgTable("CommunityCommentReaction", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  commentId: uuid("comment_id")
    .notNull()
    .references(() => communityComment.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  reactionType: text("reaction_type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type CommunityCommentReaction = InferSelectModel<typeof communityCommentReaction>;

export const communityCommentReactionRelations = relations(communityCommentReaction, ({ one }) => ({
  comment: one(communityComment, {
    fields: [communityCommentReaction.commentId],
    references: [communityComment.id],
  }),
  user: one(user, {
    fields: [communityCommentReaction.userId],
    references: [user.id],
  }),
}));

// Community Courses
export const communityCourse = pgTable("CommunityCourse", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  communityId: uuid("community_id")
    .notNull()
    .references(() => community.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  instructorId: uuid("instructor_id")
    .notNull()
    .references(() => user.id),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"), // in minutes
  level: text("level").notNull().default("beginner"), // "beginner", "intermediate", "advanced"
  price: decimal("price", { precision: 10, scale: 2 }),
  enrollmentCount: integer("enrollment_count").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type CommunityCourse = InferSelectModel<typeof communityCourse>;

export const communityCourseRelations = relations(communityCourse, ({ one, many }) => ({
  community: one(community, {
    fields: [communityCourse.communityId],
    references: [community.id],
  }),
  instructor: one(user, {
    fields: [communityCourse.instructorId],
    references: [user.id],
  }),
  lessons: many(communityCourseLesson),
  enrollments: many(communityCourseEnrollment),
}));

// Course Lessons
export const communityCourseLesson = pgTable("CommunityCourseLesson", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => communityCourse.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  videoUrl: text("video_url"),
  order: integer("order").notNull(),
  duration: integer("duration"), // in minutes
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type CommunityCourseLesson = InferSelectModel<typeof communityCourseLesson>;

export const communityCourseLessonRelations = relations(communityCourseLesson, ({ one }) => ({
  course: one(communityCourse, {
    fields: [communityCourseLesson.courseId],
    references: [communityCourse.id],
  }),
}));

// Course Enrollments
export const communityCourseEnrollment = pgTable("CommunityCourseEnrollment", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => communityCourse.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  progress: integer("progress").notNull().default(0), // percentage
  completedLessons: json("completed_lessons"), // Array of lesson IDs
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export type CommunityCourseEnrollment = InferSelectModel<typeof communityCourseEnrollment>;

export const communityCourseEnrollmentRelations = relations(communityCourseEnrollment, ({ one }) => ({
  course: one(communityCourse, {
    fields: [communityCourseEnrollment.courseId],
    references: [communityCourse.id],
  }),
  user: one(user, {
    fields: [communityCourseEnrollment.userId],
    references: [user.id],
  }),
}));

// Community Events/Calendar
export const communityEvent = pgTable("CommunityEvent", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  communityId: uuid("community_id")
    .notNull()
    .references(() => community.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  hostId: uuid("host_id")
    .notNull()
    .references(() => user.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"), // physical or virtual
  meetingLink: text("meeting_link"), // for virtual events
  maxAttendees: integer("max_attendees"),
  attendeeCount: integer("attendee_count").notNull().default(0),
  isPublic: boolean("is_public").notNull().default(true),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type CommunityEvent = InferSelectModel<typeof communityEvent>;

export const communityEventRelations = relations(communityEvent, ({ one, many }) => ({
  community: one(community, {
    fields: [communityEvent.communityId],
    references: [community.id],
  }),
  host: one(user, {
    fields: [communityEvent.hostId],
    references: [user.id],
  }),
  attendees: many(communityEventAttendee),
}));

// Event Attendees
export const communityEventAttendee = pgTable("CommunityEventAttendee", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => communityEvent.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("going"), // "going", "maybe", "not_going"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type CommunityEventAttendee = InferSelectModel<typeof communityEventAttendee>;

export const communityEventAttendeeRelations = relations(communityEventAttendee, ({ one }) => ({
  event: one(communityEvent, {
    fields: [communityEventAttendee.eventId],
    references: [communityEvent.id],
  }),
  user: one(user, {
    fields: [communityEventAttendee.userId],
    references: [user.id],
  }),
}));

// Community Leaderboard
export const communityLeaderboard = pgTable("CommunityLeaderboard", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  communityId: uuid("community_id")
    .notNull()
    .references(() => community.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  points: integer("points").notNull().default(0),
  postsCount: integer("posts_count").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  reactionsReceived: integer("reactions_received").notNull().default(0),
  coursesCompleted: integer("courses_completed").notNull().default(0),
  eventsAttended: integer("events_attended").notNull().default(0),
  rank: integer("rank"),
  badges: json("badges"), // Array of badge objects
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type CommunityLeaderboard = InferSelectModel<typeof communityLeaderboard>;

export const communityLeaderboardRelations = relations(communityLeaderboard, ({ one }) => ({
  community: one(community, {
    fields: [communityLeaderboard.communityId],
    references: [community.id],
  }),
  user: one(user, {
    fields: [communityLeaderboard.userId],
    references: [user.id],
  }),
}));

// Hypnosis E-book Leads Schema
export const hypnosisLead = pgTable("HypnosisLead", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  allowMarketing: boolean("allow_marketing").notNull().default(false),
  allowHypnosisKnowledge: boolean("allow_hypnosis_knowledge").notNull().default(false),
  ebookSent: boolean("ebook_sent").notNull().default(false),
  ebookSentAt: timestamp("ebook_sent_at"),
  source: varchar("source", { length: 50 }).notNull().default("hypno-landing"), // marketing source tracking
  notes: text("notes"), // Any additional notes
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type HypnosisLead = InferSelectModel<typeof hypnosisLead>;

// Registration Token Schema for 2FA Registration Tracking
export const registrationToken = pgTable("RegistrationToken", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  email: varchar("email", { length: 255 }).notNull(),
  serviceName: varchar("service_name", { length: 255 }).notNull(),
  callbackUrl: text("callback_url"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, completed, rejected, expired
  seedId: varchar("seed_id", { length: 255 }),
  totpSeed: text("totp_seed"), // Encrypted TOTP seed
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  completedAt: timestamp("completed_at"),
});

export type RegistrationToken = InferSelectModel<typeof registrationToken>;
