import backendApi from "./api";
import { AuthError } from "./errors";
import { APIWatchlist } from "./types";

export default async function getWatchlist(token: string) {
    return backendApi
        .get("/api/watchlist", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => APIWatchlist.parse(response.data))
        .catch((error) => {
            if (error?.response?.status == 401) {
                throw new AuthError(JSON.stringify(error?.response?.body));
            }
            throw error;
        });
}
