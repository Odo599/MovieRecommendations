import info from "~/lib/info";
import type { Route } from "./+types/test.tsx";
import { useState } from "react";
import login from "~/lib/login";
import search from "~/lib/search";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Movie Recommendations" }];
}

export default function Test() {
    const [status, setStatus] = useState("");

    const errorHandler = (err: Error) => {
        if (err.name == "RateLimitError") setStatus("Rate limited");
        else if (err.name == "AuthError") setStatus("Not logged in");
    };

    const onClickLogin = () => {
        setStatus("loading...");
        login("owen00064@gmail.com", "testpass")
            .then(setStatus)
            .catch(errorHandler);
    };

    const onClickSearch = () => {
        setStatus("loading...");
        search("bourne").then(setStatus).catch(errorHandler);
    };

    const onClickInfo = () => {
        setStatus("loading...");
        info(603).then(setStatus).catch(errorHandler);
    };

    const buttonClasses = "m-1 p-2 rounded-md bg-pink-700";

    return (
        <div className="pl-3">
            <button className={buttonClasses} onClick={onClickLogin}>
                Login
            </button>
            <button className={buttonClasses} onClick={onClickSearch}>
                Search
            </button>
            <button className={buttonClasses} onClick={onClickInfo}>
                Info
            </button>

            <p>{status}</p>
        </div>
    );
}
