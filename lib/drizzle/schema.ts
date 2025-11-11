import { pgTable, foreignKey, uuid, timestamp, json, boolean, text, unique, varchar, numeric, integer } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const chat = pgTable("Chat", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	messages: json().notNull(),
	userId: uuid().notNull(),
},
(table) => {
	return {
		chatUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Chat_userId_User_id_fk"
		}),
	}
});

export const reservation = pgTable("Reservation", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	details: json().notNull(),
	hasCompletedPayment: boolean().default(false).notNull(),
	userId: uuid().notNull(),
},
(table) => {
	return {
		reservationUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Reservation_userId_User_id_fk"
		}),
	}
});

export const memory = pgTable("Memory", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		memoryUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Memory_user_id_User_id_fk"
		}),
	}
});

export const apikey = pgTable("apikey", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid().notNull(),
	hashedKey: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	lastUsedAt: timestamp({ mode: 'string' }),
	name: text(),
},
(table) => {
	return {
		apikeyUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "apikey_userId_User_id_fk"
		}).onDelete("cascade"),
		apikeyHashedKeyUnique: unique("apikey_hashedKey_unique").on(table.hashedKey),
	}
});

export const task = pgTable("Task", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	description: text().notNull(),
	status: text().default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		taskUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Task_user_id_User_id_fk"
		}),
	}
});

export const protocol = pgTable("Protocol", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: text().notNull(),
	description: text(),
	parts: json().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		protocolUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Protocol_user_id_User_id_fk"
		}),
	}
});

export const definition = pgTable("Definition", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: text().notNull(),
	description: text(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		definitionUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Definition_user_id_User_id_fk"
		}),
	}
});

export const meditation = pgTable("Meditation", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	type: text().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	duration: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		meditationUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Meditation_user_id_User_id_fk"
		}),
	}
});

export const script = pgTable("Script", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	title: text().notNull(),
	description: text(),
	content: text().notNull(),
	language: text().default('english').notNull(),
	tags: json(),
	isPublic: boolean("is_public").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	hookType: text("hook_type").notNull(),
	mainContentType: text("main_content_type").default('storytelling').notNull(),
	contentFolderLink: text("content_folder_link"),
	productionVideoLink: text("production_video_link"),
	uploadedVideoLinks: json("uploaded_video_links"),
	status: text().default('in-progress').notNull(),
},
(table) => {
	return {
		scriptUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Script_user_id_User_id_fk"
		}),
	}
});

export const customContentType = pgTable("CustomContentType", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	value: text().notNull(),
	label: text().notNull(),
	description: text().notNull(),
	example: text().notNull(),
	structure: text().notNull(),
	category: text().notNull(),
	isPublic: boolean("is_public").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		customContentTypeUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "CustomContentType_user_id_User_id_fk"
		}),
	}
});

export const customHook = pgTable("CustomHook", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	value: text().notNull(),
	label: text().notNull(),
	description: text().notNull(),
	example: text().notNull(),
	structure: text().notNull(),
	isPublic: boolean("is_public").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		customHookUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "CustomHook_user_id_User_id_fk"
		}),
	}
});

export const userFavorites = pgTable("UserFavorites", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	favoriteType: varchar("favorite_type", { length: 20 }).notNull(),
	favoriteId: varchar("favorite_id", { length: 100 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		userFavoritesUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "UserFavorites_user_id_User_id_fk"
		}),
	}
});

export const user = pgTable("User", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 64 }).notNull(),
	password: varchar({ length: 64 }),
	role: varchar({ length: 20 }).default('user').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	subscription: varchar({ length: 20 }).default('free').notNull(),
	fullName: varchar("full_name", { length: 255 }),
	phoneNumber: varchar("phone_number", { length: 20 }),
	notMytxEmail: varchar("not_mytx_email", { length: 255 }),
	profileImageUrl: text("profile_image_url"),
	paypalSubscriptionId: varchar("paypal_subscription_id", { length: 255 }),
	totpEnabled: boolean("totp_enabled").default(false).notNull(),
});

export const quoteTemplate = pgTable("QuoteTemplate", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	title: text().notNull(),
	description: text(),
	businessType: text("business_type").notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	allowGuestSubmissions: boolean("allow_guest_submissions").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		quoteTemplateUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "QuoteTemplate_user_id_User_id_fk"
		}),
	}
});

export const quoteResponse = pgTable("QuoteResponse", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	templateId: uuid("template_id").notNull(),
	customerName: text("customer_name"),
	customerEmail: text("customer_email"),
	customerPhone: text("customer_phone"),
	selectedItems: json("selected_items").notNull(),
	selectedOptions: json("selected_options").notNull(),
	parameterValues: json("parameter_values"),
	totalMinPrice: numeric("total_min_price", { precision: 10, scale:  2 }),
	totalMaxPrice: numeric("total_max_price", { precision: 10, scale:  2 }),
	notes: text(),
	status: text().default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		quoteResponseTemplateIdQuoteTemplateIdFk: foreignKey({
			columns: [table.templateId],
			foreignColumns: [quoteTemplate.id],
			name: "QuoteResponse_template_id_QuoteTemplate_id_fk"
		}),
	}
});

export const quoteItem = pgTable("QuoteItem", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	templateId: uuid("template_id").notNull(),
	title: text().notNull(),
	description: text(),
	isRequired: boolean("is_required").default(false).notNull(),
	itemType: text("item_type").notNull(),
	fixedPrice: numeric("fixed_price", { precision: 10, scale:  2 }),
	minPrice: numeric("min_price", { precision: 10, scale:  2 }),
	maxPrice: numeric("max_price", { precision: 10, scale:  2 }),
	parameterType: text("parameter_type"),
	parameterUnit: text("parameter_unit"),
	pricePerUnit: numeric("price_per_unit", { precision: 10, scale:  2 }),
	minUnits: integer("min_units"),
	maxUnits: integer("max_units"),
	displayOrder: integer("display_order").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	parameterPricingMode: text("parameter_pricing_mode"),
	minPricePerUnit: numeric("min_price_per_unit", { precision: 10, scale:  2 }),
	maxPricePerUnit: numeric("max_price_per_unit", { precision: 10, scale:  2 }),
},
(table) => {
	return {
		quoteItemTemplateIdQuoteTemplateIdFk: foreignKey({
			columns: [table.templateId],
			foreignColumns: [quoteTemplate.id],
			name: "QuoteItem_template_id_QuoteTemplate_id_fk"
		}).onDelete("cascade"),
	}
});

export const quoteOption = pgTable("QuoteOption", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	itemId: uuid("item_id").notNull(),
	title: text().notNull(),
	description: text(),
	fixedPrice: numeric("fixed_price", { precision: 10, scale:  2 }),
	minPrice: numeric("min_price", { precision: 10, scale:  2 }),
	maxPrice: numeric("max_price", { precision: 10, scale:  2 }),
	displayOrder: integer("display_order").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	pricingType: text("pricing_type").default('fixed').notNull(),
},
(table) => {
	return {
		quoteOptionItemIdQuoteItemIdFk: foreignKey({
			columns: [table.itemId],
			foreignColumns: [quoteItem.id],
			name: "QuoteOption_item_id_QuoteItem_id_fk"
		}).onDelete("cascade"),
	}
});

export const scriptSeries = pgTable("ScriptSeries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: text().notNull(),
	description: text(),
	order: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		scriptSeriesUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "ScriptSeries_user_id_User_id_fk"
		}),
	}
});

export const scriptSeriesLink = pgTable("ScriptSeriesLink", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	scriptId: uuid("script_id").notNull(),
	seriesId: uuid("series_id").notNull(),
	orderInSeries: integer("order_in_series").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		scriptSeriesLinkScriptIdScriptIdFk: foreignKey({
			columns: [table.scriptId],
			foreignColumns: [script.id],
			name: "ScriptSeriesLink_script_id_Script_id_fk"
		}).onDelete("cascade"),
		scriptSeriesLinkSeriesIdScriptSeriesIdFk: foreignKey({
			columns: [table.seriesId],
			foreignColumns: [scriptSeries.id],
			name: "ScriptSeriesLink_series_id_ScriptSeries_id_fk"
		}).onDelete("cascade"),
	}
});

export const prompt = pgTable("Prompt", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	title: text().notNull(),
	description: text(),
	promptText: text("prompt_text").notNull(),
	category: text().default('general').notNull(),
	tags: json(),
	isFavorite: boolean("is_favorite").default(false).notNull(),
	isPublic: boolean("is_public").default(false).notNull(),
	usageCount: integer("usage_count").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		promptUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Prompt_user_id_User_id_fk"
		}),
	}
});

export const meeting = pgTable("Meeting", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	title: text().notNull(),
	description: text(),
	meetingType: text("meeting_type").notNull(),
	imageUrl: text("image_url"),
	startTime: timestamp("start_time", { mode: 'string' }).notNull(),
	endTime: timestamp("end_time", { mode: 'string' }).notNull(),
	timezone: text().default('UTC').notNull(),
	meetingUrl: text("meeting_url"),
	maxAttendees: integer("max_attendees"),
	isPublic: boolean("is_public").default(true).notNull(),
	requiresApproval: boolean("requires_approval").default(false).notNull(),
	status: text().default('upcoming').notNull(),
	tags: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	category: text().default('business').notNull(),
},
(table) => {
	return {
		meetingUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Meeting_user_id_User_id_fk"
		}).onDelete("cascade"),
	}
});

export const meetingAttendee = pgTable("MeetingAttendee", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	meetingId: uuid("meeting_id").notNull(),
	userId: uuid("user_id"),
	guestName: text("guest_name"),
	guestEmail: text("guest_email"),
	registrationStatus: text("registration_status").default('registered').notNull(),
	attendanceStatus: text("attendance_status").default('pending').notNull(),
	registeredAt: timestamp("registered_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		meetingAttendeeMeetingIdMeetingIdFk: foreignKey({
			columns: [table.meetingId],
			foreignColumns: [meeting.id],
			name: "MeetingAttendee_meeting_id_Meeting_id_fk"
		}).onDelete("cascade"),
		meetingAttendeeUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "MeetingAttendee_user_id_User_id_fk"
		}).onDelete("cascade"),
	}
});

export const hypnosisLead = pgTable("HypnosisLead", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fullName: varchar("full_name", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
	allowMarketing: boolean("allow_marketing").default(false).notNull(),
	allowHypnosisKnowledge: boolean("allow_hypnosis_knowledge").default(false).notNull(),
	ebookSent: boolean("ebook_sent").default(false).notNull(),
	ebookSentAt: timestamp("ebook_sent_at", { mode: 'string' }),
	source: varchar({ length: 50 }).default('hypno-landing').notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const community = pgTable("Community", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	title: text().notNull(),
	description: text(),
	communityType: text("community_type").notNull(),
	category: text().default('business').notNull(),
	imageUrl: text("image_url"),
	memberCount: integer("member_count").default(0).notNull(),
	isPublic: boolean("is_public").default(true).notNull(),
	requiresApproval: boolean("requires_approval").default(false).notNull(),
	status: text().default('active').notNull(),
	tags: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		communityUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Community_user_id_User_id_fk"
		}).onDelete("cascade"),
	}
});

export const communityMember = pgTable("CommunityMember", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	communityId: uuid("community_id").notNull(),
	userId: uuid("user_id"),
	guestName: text("guest_name"),
	guestEmail: text("guest_email"),
	membershipStatus: text("membership_status").default('member').notNull(),
	role: text().default('member').notNull(),
	joinedAt: timestamp("joined_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		communityMemberCommunityIdCommunityIdFk: foreignKey({
			columns: [table.communityId],
			foreignColumns: [community.id],
			name: "CommunityMember_community_id_Community_id_fk"
		}).onDelete("cascade"),
		communityMemberUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "CommunityMember_user_id_User_id_fk"
		}).onDelete("cascade"),
	}
});