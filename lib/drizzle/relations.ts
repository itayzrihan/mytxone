import { relations } from "drizzle-orm/relations";
import { user, chat, reservation, memory, apikey, task, protocol, definition, meditation, script, customContentType, customHook, userFavorites, quoteTemplate, quoteResponse, quoteItem, quoteOption, scriptSeries, scriptSeriesLink, prompt, meeting, meetingAttendee, community, communityMember } from "./schema";

export const chatRelations = relations(chat, ({one}) => ({
	user: one(user, {
		fields: [chat.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	chats: many(chat),
	reservations: many(reservation),
	memories: many(memory),
	apikeys: many(apikey),
	tasks: many(task),
	protocols: many(protocol),
	definitions: many(definition),
	meditations: many(meditation),
	scripts: many(script),
	customContentTypes: many(customContentType),
	customHooks: many(customHook),
	userFavorites: many(userFavorites),
	quoteTemplates: many(quoteTemplate),
	scriptSeries: many(scriptSeries),
	prompts: many(prompt),
	meetings: many(meeting),
	meetingAttendees: many(meetingAttendee),
	communities: many(community),
	communityMembers: many(communityMember),
}));

export const reservationRelations = relations(reservation, ({one}) => ({
	user: one(user, {
		fields: [reservation.userId],
		references: [user.id]
	}),
}));

export const memoryRelations = relations(memory, ({one}) => ({
	user: one(user, {
		fields: [memory.userId],
		references: [user.id]
	}),
}));

export const apikeyRelations = relations(apikey, ({one}) => ({
	user: one(user, {
		fields: [apikey.userId],
		references: [user.id]
	}),
}));

export const taskRelations = relations(task, ({one}) => ({
	user: one(user, {
		fields: [task.userId],
		references: [user.id]
	}),
}));

export const protocolRelations = relations(protocol, ({one}) => ({
	user: one(user, {
		fields: [protocol.userId],
		references: [user.id]
	}),
}));

export const definitionRelations = relations(definition, ({one}) => ({
	user: one(user, {
		fields: [definition.userId],
		references: [user.id]
	}),
}));

export const meditationRelations = relations(meditation, ({one}) => ({
	user: one(user, {
		fields: [meditation.userId],
		references: [user.id]
	}),
}));

export const scriptRelations = relations(script, ({one, many}) => ({
	user: one(user, {
		fields: [script.userId],
		references: [user.id]
	}),
	scriptSeriesLinks: many(scriptSeriesLink),
}));

export const customContentTypeRelations = relations(customContentType, ({one}) => ({
	user: one(user, {
		fields: [customContentType.userId],
		references: [user.id]
	}),
}));

export const customHookRelations = relations(customHook, ({one}) => ({
	user: one(user, {
		fields: [customHook.userId],
		references: [user.id]
	}),
}));

export const userFavoritesRelations = relations(userFavorites, ({one}) => ({
	user: one(user, {
		fields: [userFavorites.userId],
		references: [user.id]
	}),
}));

export const quoteTemplateRelations = relations(quoteTemplate, ({one, many}) => ({
	user: one(user, {
		fields: [quoteTemplate.userId],
		references: [user.id]
	}),
	quoteResponses: many(quoteResponse),
	quoteItems: many(quoteItem),
}));

export const quoteResponseRelations = relations(quoteResponse, ({one}) => ({
	quoteTemplate: one(quoteTemplate, {
		fields: [quoteResponse.templateId],
		references: [quoteTemplate.id]
	}),
}));

export const quoteItemRelations = relations(quoteItem, ({one, many}) => ({
	quoteTemplate: one(quoteTemplate, {
		fields: [quoteItem.templateId],
		references: [quoteTemplate.id]
	}),
	quoteOptions: many(quoteOption),
}));

export const quoteOptionRelations = relations(quoteOption, ({one}) => ({
	quoteItem: one(quoteItem, {
		fields: [quoteOption.itemId],
		references: [quoteItem.id]
	}),
}));

export const scriptSeriesRelations = relations(scriptSeries, ({one, many}) => ({
	user: one(user, {
		fields: [scriptSeries.userId],
		references: [user.id]
	}),
	scriptSeriesLinks: many(scriptSeriesLink),
}));

export const scriptSeriesLinkRelations = relations(scriptSeriesLink, ({one}) => ({
	script: one(script, {
		fields: [scriptSeriesLink.scriptId],
		references: [script.id]
	}),
	scriptSery: one(scriptSeries, {
		fields: [scriptSeriesLink.seriesId],
		references: [scriptSeries.id]
	}),
}));

export const promptRelations = relations(prompt, ({one}) => ({
	user: one(user, {
		fields: [prompt.userId],
		references: [user.id]
	}),
}));

export const meetingRelations = relations(meeting, ({one, many}) => ({
	user: one(user, {
		fields: [meeting.userId],
		references: [user.id]
	}),
	meetingAttendees: many(meetingAttendee),
}));

export const meetingAttendeeRelations = relations(meetingAttendee, ({one}) => ({
	meeting: one(meeting, {
		fields: [meetingAttendee.meetingId],
		references: [meeting.id]
	}),
	user: one(user, {
		fields: [meetingAttendee.userId],
		references: [user.id]
	}),
}));

export const communityRelations = relations(community, ({one, many}) => ({
	user: one(user, {
		fields: [community.userId],
		references: [user.id]
	}),
	communityMembers: many(communityMember),
}));

export const communityMemberRelations = relations(communityMember, ({one}) => ({
	community: one(community, {
		fields: [communityMember.communityId],
		references: [community.id]
	}),
	user: one(user, {
		fields: [communityMember.userId],
		references: [user.id]
	}),
}));