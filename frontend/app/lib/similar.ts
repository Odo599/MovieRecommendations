import backendApi from "./api";
import { AuthError } from "./errors";
import { APIMovies } from "./types";

export default async function similar(id: number, token: string) {
    return backendApi
        .get(`/api/movie/${id}/similar`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => APIMovies.parse(response.data))
        .catch((error) => {
            if (error?.response?.status == 401) {
                throw new AuthError(JSON.stringify(error.response.body));
            }
            throw error;
        });
}
