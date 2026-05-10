import axios from "axios";
import { RateLimitError } from "./errors";

export default async function logout(): Promise<string> {
    return axios
        .post("/api/logout", {}, { withCredentials: true })
        .then((response) => {
            return JSON.stringify(response.data);
        })
        .catch((error) => {
            if (error.response.status == 429) throw new RateLimitError("");
            console.log("error", error);
            throw error;
        });
}
