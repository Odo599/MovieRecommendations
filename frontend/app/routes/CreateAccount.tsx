import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { type Route } from "./+types/CreateAccount";
import { redirect, useNavigate } from "react-router";
import createAccount from "~/lib/createAccount";
import { UserConflictError } from "~/lib/errors";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Create Account" }];
}

export default function CreateAccount() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [status, setStatus] = useState("");

    const [loggedIn, setLoggedIn] = useLocalStorage<boolean>(
        "logged_in",
        false
    );

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        console.log(username, email, password, rePassword);
        if (password !== rePassword) {
            setStatus("Passwords don't match.");
        } else {
            try {
                await createAccount(username, email, password);
                setLoggedIn(true);
                navigate("/");
            } catch (error) {
                if (error instanceof UserConflictError) {
                    setStatus("Username or email already in use.");
                }
                console.log(error);
            }
        }
    };

    const buttonClasses = "m-1 p-2 rounded-md bg-pink-700";

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                    Username:
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label htmlFor="email">
                    Email:
                    <input
                        type="email"
                        id="email"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <label htmlFor="re-password">
                    Retype password:
                    <input
                        type="password"
                        id="re-password"
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                    />
                </label>

                <br />

                <input
                    type="submit"
                    value="Create Account"
                    className={buttonClasses}
                />
                <p>{status}</p>
            </form>
            <button
                className={buttonClasses}
                onClick={() => redirect("/login")}
            >
                Login
            </button>
            <p>Current Status: {loggedIn ? "Logged in" : "Logged out"}</p>
        </div>
    );
}
