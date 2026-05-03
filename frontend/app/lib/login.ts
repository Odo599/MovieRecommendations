import axios from "axios";
import FormData from "form-data";
import { RateLimitError } from "./errors";

export default async function login(
    email: string,
    password: string
): Promise<string> {
    let data = new FormData();
    data.append("email", email);
    data.append("password", password);

    return axios
        .post("http://127.0.0.1:5000/login", data, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            return JSON.stringify(response.data);
        })
        .catch((error) => {
            if (error.response.status == 429) throw RateLimitError("");
            console.log("error", error);
            throw error;
        });
}
