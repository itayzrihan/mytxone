import { InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./schema";

// Definition database schema
export const definitions = pgTable("Definition", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
});

export type Definition = InferSelectModel<typeof definitions>;

export const definitionsRelations = relations(definitions, ({ one }) => ({
  user: one(user, {
    fields: [definitions.userId],
    references: [user.id],
  }),
}));
