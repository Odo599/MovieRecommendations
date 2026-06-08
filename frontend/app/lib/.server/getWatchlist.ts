import backendApi from "./api";
import { AuthError } from "../errors";
import { WatchlistSchema } from "../types";

export default async function getWatchlist(
    token: string
): Promise<WatchlistSchema> {
    return backendApi
        .get("/api/watchlist", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => WatchlistSchema.parse(response.data))
        .catch((error) => {
            if (error?.response?.status == 401) {
                throw new AuthError(JSON.stringify(error?.response?.body));
            }
            console.error(error);
            throw error;
        });
}
