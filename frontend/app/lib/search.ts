import axios from "axios";
import { AuthError } from "./errors";

export default async function search(query: string) {
    return axios
        .get(`/api/movie/search?q=${query}`, {
            withCredentials: true,
        })
        .then((response) => {
            return JSON.stringify(response.data);
        })
        .catch((error) => {
            if (error?.response?.status == 401) {
                throw new AuthError(JSON.stringify(error.response.body));
            }
            throw error;
        });
}
