import info from "~/lib/info";
import type { Route } from "./+types/test.tsx";
import { useState } from "react";
import login from "~/lib/login";
import search from "~/lib/search";
import similar from "~/lib/similar";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Movie Recommendations" }];
}

export default function Home() {
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

    const onClickSimilar = () => {
        setStatus("loading...");
        similar(603).then(setStatus).catch(errorHandler);
    };

    const onClickInfo = () => {
        setStatus("loading...");
        info(603).then(setStatus).catch(errorHandler);
    };

    return (
        <div>
            <button onClick={onClickLogin}>Login</button>
            <button onClick={onClickSearch}>Search</button>
            <button onClick={onClickSimilar}>Similar</button>
            <button onClick={onClickInfo}>Info</button>

            <p>{status}</p>
        </div>
    );
}
