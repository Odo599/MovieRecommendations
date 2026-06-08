import backendApi from "./api";
import { AuthError } from "../errors";

export default async function addWatchlistItem(
    id: number,
    isMovie: boolean,
    token: string
) {
    return await backendApi
        .post(
            `/api/watchlist/${id}?isMovie=${isMovie}`,
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
            throw error;
        });
}
