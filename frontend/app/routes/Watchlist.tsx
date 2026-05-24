import {
    commitSession,
    destroySession,
    getSession,
} from "~/lib/sessions.server";
import type { Route } from "./+types/Watchlist";
import { data, redirect } from "react-router";
import getWatchlist from "~/lib/getWatchlist";
import { AuthError } from "~/lib/errors";

export function meta() {
    return [{ title: "Watchlist" }];
}

export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.has("token")) {
        return redirect("/");
    }

    const token = session.get("token") as string;
    try {
        const watchlist = await getWatchlist(token);
        return data(
            {
                watchlist: watchlist,
                success: true,
                error: "",
            },
            {
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            }
        );
    } catch (error) {
        if (error instanceof AuthError) {
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session),
                },
            });
        }
        return data({
            watchlist: null,
            success: false,
            error: "An unknown error occurred",
        });
    }
}

export default function Watchlist({ loaderData }: Route.ComponentProps) {
    const { watchlist, success, error } = loaderData;
    if (success && watchlist !== null) {
        return <div>{JSON.stringify(watchlist)}</div>;
    } else {
        return (
            <div>
                Unfortunately, something went wrong.
                {error}
            </div>
        );
    }
}
