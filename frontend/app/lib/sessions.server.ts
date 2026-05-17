import { createCookieSessionStorage } from "react-router";

type SessionData = {
    loggedIn: string;
};

type SessionFlashData = {
    error: string;
};

const { getSession, commitSession, destroySession } =
    createCookieSessionStorage<SessionData, SessionFlashData>({
        cookie: {
            name: "__session__",
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secrets: ["s3cret1"],
            secure: true,
        },
    });

export { getSession, commitSession, destroySession };
