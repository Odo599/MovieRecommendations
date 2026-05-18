import backendApi from "./api";
import FormData from "form-data";
import { AuthError, RateLimitError, ServerError } from "./errors";

export default async function login(
    email: string,
    password: string
): Promise<string> {
    let data = new FormData();
    data.append("email", email);
    data.append("password", password);

    return backendApi
        .post("/api/login", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            if (Object.hasOwn(response.data, "access_token")) {
                return response.data.access_token;
            }
            throw new ServerError(response.data);
        })
        .catch((error) => {
            if (error?.response?.status == 429) throw new RateLimitError("");
            if (error?.response?.status == 401) throw new AuthError("");
            console.log("error", error);
            throw error;
        });
}
