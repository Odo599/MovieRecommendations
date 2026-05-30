import { usersTable, watchlistTable } from "./db/schema";
import { eq, and } from "drizzle-orm";
import { db } from ".";

export async function getUserFromEmail(email: string) {
    const existingUsers = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

    if (existingUsers.length > 0) return existingUsers[0]!;
    return null;
}

export async function getWatchlist(email: string) {
    const user = await getUserFromEmail(email);
    if (user == null) return [];

    return await db
        .select()
        .from(watchlistTable)
        .where(eq(watchlistTable.userId, user.id));
}

export async function addUser(user: typeof usersTable.$inferInsert) {
    await db.insert(usersTable).values(user);
}

export async function addWatchlistItem(
    item: typeof watchlistTable.$inferInsert
) {
    const [insertedItem] = await db
        .insert(watchlistTable)
        .values(item)
        .onConflictDoNothing()
        .returning();
    if (!insertedItem) {
        return null;
    }
    return insertedItem;
}

export async function deleteWatchlistItem(
    user: typeof usersTable.$inferSelect,
    id: string
) {
    const [deletedItem] = await db
        .delete(watchlistTable)
        .where(
            and(eq(watchlistTable.id, id), eq(watchlistTable.userId, user.id))
        )
        .returning();
    if (deletedItem) return true;
    return false;
}
