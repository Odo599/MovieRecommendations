import { getSession, destroySession } from "~/lib/sessions.server";
import type { Route } from "./+types/Logout";
import { Link, redirect } from "react-router";
import { MainForm, WelcomeContainer } from "~/components/FormComponents";
import { PrimaryButton, PrimaryLinkButton, SecondaryButton } from "~/components/Buttons";

export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.has("loggedIn")) return redirect("/");
}

export async function action({ request }: Route.ActionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}

export default function Logout() {
    return (
        <WelcomeContainer>
            <p>Are you sure you want to log out?</p>
            <MainForm method="post">
                <SecondaryButton>Logout</SecondaryButton>
            </MainForm>
            <PrimaryLinkButton to={"/"}>Cancel</PrimaryLinkButton>
        </WelcomeContainer>
    );
}
