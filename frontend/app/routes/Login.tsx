import login from "~/lib/login";
import type { Route } from "./+types/Login";
import { AuthError, RateLimitError } from "~/lib/errors";
import { data, redirect, useNavigate } from "react-router";
import { getSession, commitSession } from "~/lib/sessions.server";
import { PrimaryButton, SecondaryButton } from "~/components/Buttons";
import {
    ErrorBox,
    FormField,
    MainForm,
    WelcomeContainer,
} from "~/components/FormComponents";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Login" }];
}

export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    if (session.has("loggedIn")) {
        return redirect("/");
    }

    return data(
        { error: session.get("error"), loginData: session.get("loginData") },
        {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        }
    );
}

export async function action({ request }: Route.ActionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const form = await request.formData();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    async function failure(text: string) {
        session.flash("error", text);
        session.flash("loginData", { email: email, password: password });
        return redirect("/login", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    }

    if (email && password) {
        try {
            await login(email, password);
            session.set("loggedIn", "true");
            return redirect("/", {
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            });
        } catch (error) {
            if (error instanceof RateLimitError) {
                return failure("Please wait a few seconds and try again.");
            }
            if (error instanceof AuthError) {
                return failure("Incorrect username or password.");
            }
            return failure("An unknown error occured.");
        }
    } else {
        return failure("Username or password not provided");
    }
}

export default function Login({ loaderData }: Route.ComponentProps) {
    const { error, loginData } = loaderData;
    const navigate = useNavigate();

    return (
        <WelcomeContainer>
            <MainForm method="POST">
                <FormField
                    type="email"
                    name="email"
                    defaultValue={loginData?.email}
                >
                    Email:
                </FormField>
                <FormField
                    type="password"
                    name="password"
                    defaultValue={loginData?.password}
                >
                    Password:
                </FormField>
                <PrimaryButton type="submit">Login</PrimaryButton>
            </MainForm>
            <ErrorBox text={error} />
            <SecondaryButton onClick={() => navigate("/create-account")}>
                Create Account
            </SecondaryButton>
        </WelcomeContainer>
    );
}
