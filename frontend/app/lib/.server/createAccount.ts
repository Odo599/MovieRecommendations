import backendApi from "./api";
import FormData from "form-data";
import { RateLimitError, ServerError, UserConflictError } from "../errors";

export default async function createAccount(
    username: string,
    email: string,
    password: string,
    countryCode: string
): Promise<string> {
    let data = new FormData();
    data.append("email", email);
    data.append("password", password);
    data.append("username", username);
    data.append("country_code", countryCode);

    return backendApi
        .post("/api/users/create", data, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            if (Object.hasOwn(response.data, "access_token")) {
                return response.data.access_token;
            } else throw new ServerError(response.data);
        })
        .catch((error) => {
            if (error?.response?.status == 429) throw new RateLimitError("");
            if (error?.response?.status == 409) throw new UserConflictError("");
            console.log("error", error);
            throw error;
        });
}
