
import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { email } from "zod";


export const usersTable = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom(),

    firstName: varchar('first_name', { length: 45 }).notNull(),
    lastName: varchar('last_name', { length: 45 }),
    email: varchar('email', { length: 255 }).notNull().unique(),

    emailVerified: boolean('email_verified').default(false).notNull(),

    password: varchar('password', { length: 255 }).notNull(),
    salt: text('salt').notNull(),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});


