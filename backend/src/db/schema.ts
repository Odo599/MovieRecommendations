import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar({ length: 255 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    passwordHash: varchar({ length: 255 }).notNull(),
    countryCode: varchar({ length: 255 }).notNull(),
});

export const watchlistTable = pgTable("watchlist", {
    id: uuid().defaultRandom().primaryKey(),
    movieId: integer().notNull(),
    userId: integer()
        .notNull()
        .references(() => usersTable.id),
});
