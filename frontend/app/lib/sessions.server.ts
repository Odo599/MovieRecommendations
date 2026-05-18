import { createCookieSessionStorage } from "react-router";

type LoginData = {
    email?: string;
    password?: string;
};

type CreateAccountData = {
    email?: string;
    username?: string;
    password?: string;
    rePassword?: string;
};

type SessionData = {
    token: string;
};

type SessionFlashData = {
    error: string;
    loginData: LoginData;
    createAccountData: CreateAccountData;
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
