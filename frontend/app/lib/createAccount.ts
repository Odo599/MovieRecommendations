import axios from "axios";
import FormData from "form-data";
import { AuthError, RateLimitError, UserConflictError } from "./errors";

export default async function createAccount(
    username: string,
    email: string,
    password: string
): Promise<string> {
    let data = new FormData();
    data.append("email", email);
    data.append("password", password);
    data.append("username", username);

    return axios
        .post("http://127.0.0.1:5000/users/create", data, {
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
            if (error.response.status == 409) throw new UserConflictError("");
            console.log("error", error);
            throw error;
        });
}
