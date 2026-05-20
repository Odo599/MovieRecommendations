import z from "zod";
import backendApi from "./api";
import { AuthError, ServerError } from "./errors";
import { APIMovies } from "./types";

export default async function search(
    query: string,
    token: string
): Promise<APIMovies> {
    return backendApi
        .get(`/api/movie/search?q=${query}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => APIMovies.parse(response.data))
        .catch((error) => {
            if (error?.response?.status == 401) {
                throw new AuthError(JSON.stringify(error.response.body));
            }
            if (error instanceof z.ZodError) {
                console.error(error);
                throw new ServerError(JSON.stringify(error));
            }
            throw error;
        });
}
