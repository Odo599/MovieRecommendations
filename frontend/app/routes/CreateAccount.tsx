import FormField from "~/components/FormField";
import { type Route } from "./+types/CreateAccount";
import { data, redirect, useNavigate } from "react-router";
import createAccount from "~/lib/createAccount";
import { RateLimitError, UserConflictError } from "~/lib/errors";
import { getSession, commitSession } from "~/lib/sessions.server";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Create Account" }];
}

export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    if (session.has("loggedIn")) {
        return redirect("/");
    }

    return data(
        { error: session.get("error") },
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

    async function failure(text: string) {
        session.flash("error", text);
        return redirect("/create-account", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    }

    if (username && email && password && rePassword) {
        if (password == rePassword) {
            try {
                await createAccount(username, email, password);
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
                if (error instanceof UserConflictError) {
                    return failure("Username or email is already in use.");
                }
                return failure("An unknown error occured.");
            }
        } else return failure("Passwords do not match.");
    } else return failure("Missing a required field.");
}

export default function CreateAccount({ loaderData }: Route.ComponentProps) {
    const { error } = loaderData;
    const navigate = useNavigate();
    const buttonClasses = "m-1 p-2 rounded-md bg-pink-700";

    return (
        <div>
            {error ? <div>Error: {error}</div> : null}
            <form method="POST">
                <FormField type="text" name="username">
                    Username:
                </FormField>
                <FormField type="email" name="email">
                    Email:
                </FormField>
                <FormField type="password" name="password">
                    Password:
                </FormField>
                <FormField type="password" name="re-password">
                    Retype password:
                </FormField>
                <input
                    type="submit"
                    value="Create Account"
                    className={buttonClasses}
                />
            </form>
            <button
                className={buttonClasses}
                onClick={() => navigate("/login")}
            >
                Login
            </button>
        </div>
    );
}
