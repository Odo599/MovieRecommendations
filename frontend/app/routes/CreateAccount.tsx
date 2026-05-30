import { type Route } from "./+types/CreateAccount";
import { data, redirect, useNavigate } from "react-router";
import createAccount from "~/lib/.server/createAccount";
import { RateLimitError, UserConflictError } from "~/lib/errors";
import { getSession, commitSession } from "~/lib/.server/sessions";
import { PrimaryButton, SecondaryButton } from "~/components/Buttons";
import {
    WelcomeContainer,
    FormField,
    MainForm,
    ErrorBox,
} from "~/components/FormComponents";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Create Account" }];
}

export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    if (session.has("token")) {
        return redirect("/");
    }

    return data(
        {
            error: session.get("error"),
            createAccountData: session.get("createAccountData"),
        },
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
    const username = form.get("username")?.toString();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();
    const rePassword = form.get("re-password")?.toString();
    const countryCode = form.get("country-code")?.toString();

    async function failure(text: string) {
        session.flash("error", text);
        session.flash("createAccountData", {
            email: email,
            password: password,
            rePassword: rePassword,
            username: username,
            countryCode: countryCode,
        });
        return redirect("/create-account", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    }

    if (username && email && password && rePassword && countryCode) {
        if (countryCode.length !== 2)
            return failure("The country code must be two letters");
        if (password == rePassword) {
            try {
                const token = await createAccount(
                    username,
                    email,
                    password,
                    countryCode.toUpperCase()
                );
                session.set("token", token);
                return redirect("/", {
                    headers: {
                        "Set-Cookie": await commitSession(session),
                    },
                });
            } catch (error) {
                if (error instanceof RateLimitError) {
                    return failure("Please wait a few seconds and try again.");
                }
                if (error instanceof UserConflictError) {
                    return failure("Username or email is already in use.");
                }
                return failure("An unknown error occurred.");
            }
        } else return failure("Passwords do not match.");
    } else return failure("Missing a required field.");
}

export default function CreateAccount({ loaderData }: Route.ComponentProps) {
    const { error, createAccountData } = loaderData;
    const navigate = useNavigate();

    return (
        <WelcomeContainer>
            <MainForm method="POST">
                <FormField
                    type="text"
                    name="username"
                    defaultValue={createAccountData?.username}
                >
                    Username:
                </FormField>
                <FormField
                    type="email"
                    name="email"
                    defaultValue={createAccountData?.email}
                >
                    Email:
                </FormField>
                <FormField
                    type="password"
                    name="password"
                    defaultValue={createAccountData?.password}
                >
                    Password:
                </FormField>
                <FormField
                    type="password"
                    name="re-password"
                    defaultValue={createAccountData?.rePassword}
                >
                    Retype password:
                </FormField>
                <FormField
                    type="text"
                    name="country-code"
                    defaultValue={createAccountData?.country_code}
                >
                    Enter your country code
                </FormField>

                <PrimaryButton type="submit">Create Account</PrimaryButton>
            </MainForm>
            <ErrorBox text={error} />
            <SecondaryButton onClick={() => navigate("/login")}>
                Login
            </SecondaryButton>
        </WelcomeContainer>
    );
}
