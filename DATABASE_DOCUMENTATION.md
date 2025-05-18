# Database Documentation for mytx-ai Project

This document provides comprehensive guidelines on how to interact with the database system used in the mytx-ai project, including how to update schemas and push changes to the production database.

## Table of Contents

1. [Database Overview](#database-overview)
2. [Schema Structure](#schema-structure)
3. [Database Queries](#database-queries)
4. [Adding New Tables](#adding-new-tables)
5. [Modifying Existing Tables](#modifying-existing-tables)
6. [Migration Process](#migration-process)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Database Overview

The mytx-ai project uses PostgreSQL as its database system, managed through the Drizzle ORM. This provides type safety, schema validation, and migration capabilities.

### Key Components

- **PostgreSQL Database**: Production database hosted on a cloud provider
- **Drizzle ORM**: For type-safe database interactions
- **Database Schema**: Defined in TypeScript files
- **Migrations**: Automatically generated and managed by Drizzle

### Environment Setup

The database connection relies on the following environment variables:

- `POSTGRES_URL`: The connection string to your PostgreSQL database

These variables should be defined in your `.env.local` file for local development.

## Schema Structure

The database schema is primarily defined in `db/schema.ts`. This file contains table definitions, relationships, and TypeScript types for each entity.

### Current Tables

1. **User**: Stores user authentication information
2. **Chat**: Stores chat history and messages
3. **Reservation**: Stores flight reservation details
4. **Memory**: Stores user-specific memory items
5. **Task**: Stores user tasks
6. **ApiKey**: Stores API keys for authentication
7. **Protocol**: Stores protocol definitions with customizable parts

### Schema Definition Example

```typescript
// Table definition example
export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
});

// Type definition
export type User = InferSelectModel<typeof user>;

// Relationship definition
export const userRelations = relations(user, ({ many }) => ({
  chats: many(chat),
  reservations: many(reservation),
  memories: many(memories),
  apiKeys: many(apiKey),
  tasks: many(tasks),
}));
```

## Database Queries

Database operations are centralized in the `db/queries.ts` file. This file exports functions for CRUD operations on each entity.

### Connection Setup

```typescript
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client, { schema }); // Pass the schema to drizzle
```

### Query Examples

#### User Queries

```typescript
// Get user by email
export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

// Create a new user
export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}
```

#### Chat Queries

```typescript
// Save chat
export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
}) {
  try {
    const selectedChats = await db.select().from(chat).where(eq(chat.id, id));

    if (selectedChats.length > 0) {
      return await db
        .update(chat)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chat.id, id));
    }

    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      messages: JSON.stringify(messages),
      userId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}
```

## Adding New Tables

To add a new table to the database:

1. Open `db/schema.ts`
2. Define the new table using the `pgTable` constructor
3. Define the TypeScript type for the table
4. Define any relationships using the `relations` function
5. Update existing relationship definitions if needed

### Example: Adding a Comments Table

```typescript
// 1. Define the table
export const comments = pgTable("Comment", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// 2. Define the TypeScript type
export type Comment = InferSelectModel<typeof comments>;

// 3. Define relationships
export const commentRelations = relations(comments, ({ one }) => ({
  user: one(user, {
    fields: [comments.userId],
    references: [user.id],
  }),
  chat: one(chat, {
    fields: [comments.chatId],
    references: [chat.id],
  }),
}));

// 4. Update existing relationships
export const userRelations = relations(user, ({ many }) => ({
  chats: many(chat),
  reservations: many(reservation),
  memories: many(memories),
  apiKeys: many(apiKey),
  tasks: many(tasks),
  comments: many(comments), // Add this line
}));

export const chatRelations = relations(chat, ({ one, many }) => ({
  user: one(user, {
    fields: [chat.userId],
    references: [user.id],
  }),
  comments: many(comments), // Add this line
}));
```

5. Create query functions in `db/queries.ts` for the new table:

```typescript
export async function addComment({
  userId,
  chatId,
  content,
}: {
  userId: string;
  chatId: string;
  content: string;
}) {
  try {
    return await db.insert(comments).values({
      userId,
      chatId,
      content,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to add comment to database");
    throw error;
  }
}

export async function getCommentsByChatId({ chatId }: { chatId: string }) {
  try {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.chatId, chatId))
      .orderBy(desc(comments.createdAt));
  } catch (error) {
    console.error("Failed to get comments by chat id from database");
    throw error;
  }
}
```

## Modifying Existing Tables

To modify an existing table:

1. Open `db/schema.ts`
2. Update the table definition with the new fields or changes
3. Update the corresponding TypeScript type if needed
4. Update any related functions in `db/queries.ts`

### Example: Adding a Field to a Table

```typescript
// Before
export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
});

// After
export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
  displayName: varchar("displayName", { length: 100 }),
  avatarUrl: varchar("avatarUrl", { length: 255 }),
});
```

### Protocol Schema Structure

The Protocol table is defined in a separate schema file (`db/protocols-schema.ts`) but it's related to the main schema through imports and references:

```typescript
// Protocol schema definition
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

// Relationship with User table
export const protocolsRelations = relations(protocols, ({ one }) => ({
  user: one(user, {
    fields: [protocols.userId],
    references: [user.id],
  }),
}));
```

#### Protocol Query Functions

Protocol database operations are defined in `db/protocol-queries.ts`:

```typescript
// Save a new protocol
export async function saveProtocol({
  userId,
  name,
  description,
  parts,
}: {
  userId: string;
  name: string;
  description?: string;
  parts: Array<{ content: string }>;
}): Promise<Array<Protocol>> {
  try {
    const newProtocol = await db
      .insert(protocols)
      .values({
        userId,
        name,
        description: description || null,
        parts: JSON.stringify(parts),
      })
      .returning();
    return newProtocol;
  } catch (error) {
    console.error("Failed to save protocol in database:", error);
    throw error;
  }
}

// Get all protocols for a user
export async function getProtocolsByUserId({
  userId,
}: {
  userId: string;
}): Promise<Array<Protocol>> {
  try {
    return await db
      .select()
      .from(protocols)
      .where(eq(protocols.userId, userId))
      .orderBy(desc(protocols.createdAt));
  } catch (error) {
    console.error("Failed to get protocols by user from database:", error);
    throw error;
  }
}
```

## Migration Process

The project uses Drizzle Kit to generate and apply migrations. Migrations are stored in the `lib/drizzle` directory.

### Generating Migrations

After making changes to the schema, you need to generate a migration:

```bash
npx drizzle-kit generate
```

This command will:
1. Compare the current state of your database schema with the schema defined in your code
2. Generate SQL migration files in the `lib/drizzle` directory

### Applying Migrations

To apply the generated migrations to your database:

```bash
npx tsx db/migrate.ts
```

This will run the `migrate.ts` script which:
1. Connects to your database using the `POSTGRES_URL` environment variable
2. Applies any pending migrations from the `lib/drizzle` directory
3. Updates the database schema to match your code

### Adding a Schema in Multiple Files

If your schema grows large, you can split it into multiple files:

1. Create a new schema file (e.g., `protocols-schema.ts`) with your new tables
2. Make sure to import any dependencies from the main schema
3. Update the `drizzle.config.ts` file to include the new schema file:

```typescript
export default defineConfig({
  schema: ["./db/schema.ts", "./db/protocols-schema.ts"],
  out: "./lib/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

4. Import the new schema in your main schema file to establish relationships:

```typescript
import { protocols } from "./protocols-schema";

export const userRelations = relations(user, ({ many }) => ({
  // ... existing relations
  protocols: many(protocols),
}));
```

### Migration in Production

In production environments:

1. Always backup your database before running migrations
2. Consider using a deployment pipeline that runs migrations automatically
3. Test migrations in a staging environment before applying to production

## Best Practices

### SQL and Query Performance

1. Use appropriate indexes for frequently queried columns
2. Be mindful of the types you choose for columns (e.g., using UUID vs. serial)
3. For large datasets, consider pagination using LIMIT and OFFSET
4. Use transactions for operations that need to be atomic

### Schema Design

1. Follow normalization principles to avoid data redundancy
2. Use appropriate relationships between tables (one-to-one, one-to-many, many-to-many)
3. Use JSON fields for unstructured data, but avoid overusing them
4. Use appropriate constraints (NOT NULL, UNIQUE, etc.)

### Error Handling

Always include proper error handling in database queries:

```typescript
try {
  // Database operation
} catch (error) {
  console.error("Operation failed:", error);
  throw error; // Or handle appropriately
}
```

### Securing Sensitive Data

1. Never store plaintext passwords (use bcrypt or similar)
2. Consider encrypting sensitive data before storing
3. Use parameterized queries to prevent SQL injection
4. Implement proper access controls

## Troubleshooting

### Common Migration Issues

1. **Migration Conflicts**: If you have conflicts between local changes and the database state, you might need to reset your migration history:
   ```bash
   npx drizzle-kit drop
   npx drizzle-kit generate
   npx tsx db/migrate.ts
   ```
   Note: Only use this in development environments!

2. **Connection Issues**:
   - Verify your `POSTGRES_URL` environment variable
   - Check network access to your database
   - Ensure database user has proper permissions

3. **Schema Validation Errors**:
   - Ensure all types match between code and database
   - Check for missing NOT NULL constraints
   - Verify foreign key relationships

### Debugging Tips

1. Enable SQL logging in development:
   ```typescript
   const db = drizzle(client, { 
     schema,
     logger: true
   });
   ```

2. Use explicit types for all function parameters and return values

3. Test your database changes locally before deploying

---

For additional support or questions about database management, please refer to:
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- Internal team communication channels
