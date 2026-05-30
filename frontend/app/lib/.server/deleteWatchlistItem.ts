import backendApi from "./api";
import { AuthError } from "../errors";

export default async function deleteWatchlistItem(id: string, token: string) {
    await backendApi
        .delete(`/api/watchlist/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .catch((error) => {
            if (error?.response?.status == 401) {
                throw new AuthError(JSON.stringify(error.response?.body));
            }
            throw error;
        });
}
