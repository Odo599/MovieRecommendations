import axios from "axios";
import FormData from "form-data";
import { AuthError, RateLimitError } from "./errors";

export default async function login(
    email: string,
    password: string
): Promise<string> {
    let data = new FormData();
    data.append("email", email);
    data.append("password", password);

    return axios
        .post("/api/login", data, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            return JSON.stringify(response.data);
        })
        .catch((error) => {
            if (error.response.status == 429) throw new RateLimitError("");
            if (error.response.status == 401) throw new AuthError("");
            console.log("error", error);
            throw error;
        });
}
