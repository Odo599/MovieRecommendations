import backendApi from "./api";
import { AuthError } from "./errors";

export default async function addWatchlistItem(id: number, token: string) {
    backendApi
        .post(
            `/api/watchlist/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .catch((error) => {
            if (error?.response?.status == 401) {
                throw new AuthError(JSON.stringify(error.response?.body));
            }
        });
}
