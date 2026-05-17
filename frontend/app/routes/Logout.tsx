import { getSession, destroySession } from "~/lib/sessions.server";
import type { Route } from "./+types/Logout";
import { Link, redirect } from "react-router";

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
        <>
            <p>Are you sure you want to log out?</p>
            <form method="post">
                <button>Logout</button>
            </form>
            <Link to={"/"}>Cancel</Link>
        </>
    );
}
