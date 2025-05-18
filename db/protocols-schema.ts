import { InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  json,
  uuid,
  text,
} from "drizzle-orm/pg-core";
import { user } from "./schema";

// Protocol database schema
export const protocols = pgTable("Protocol", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
  description: text("description"),
  parts: json("parts").notNull(), // Stores array of ProtocolPart objects
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export type Protocol = InferSelectModel<typeof protocols>;

export const protocolsRelations = relations(protocols, ({ one }) => ({
  user: one(user, {
    fields: [protocols.userId],
    references: [user.id],
  }),
}));
