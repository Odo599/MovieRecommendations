import login from "~/lib/login";
import type { Route } from "./+types/Login";
import { useLocalStorage } from "usehooks-ts";
import { useState } from "react";
import { AuthError } from "~/lib/errors";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Login" }];
}

export default function Login() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useLocalStorage<boolean>("logged_in", true);
    const [logInStatus, setLogInStatus] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const buttonClasses = "m-1 p-2 rounded-md bg-pink-700";

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoggedIn(true);
        try {
            await login(email, password);
        } catch (e) {
            if (e instanceof AuthError) {
                setLogInStatus("Incorrect password.");
                // todo clear password
            }
        }

        console.log(email, password);
    };

    const redirectCreateAccount = async () => {
        navigate("/create-account")
        // todo create account page
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">
                    Email:
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <br />
                <label htmlFor="password">
                    Password:
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />

                <input type="submit" value="Login" className={buttonClasses} />
                <p>Status: {logInStatus}</p>
            </form>
            <button className={buttonClasses} onClick={redirectCreateAccount}>
                Create Account
            </button>
            <p>Current Status: {loggedIn ? "Logged in" : "Logged out"}</p>
        </div>
    );
}
