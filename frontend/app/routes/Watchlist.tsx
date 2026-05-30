import {
    commitSession,
    destroySession,
    getSession,
} from "~/lib/.server/sessions";
import type { Route } from "./+types/Watchlist";
import { data, redirect, useFetcher } from "react-router";
import getWatchlist from "~/lib/.server/getWatchlist";
import { AuthError } from "~/lib/errors";
import WatchlistCard from "~/components/WatchlistCard";
import deleteWatchlistItem from "~/lib/.server/deleteWatchlistItem";
import HeaderText from "~/components/HeaderText";
import DropDown from "~/components/DropDown";
import { useMemo, useState } from "react";

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
            error: JSON.stringify(error),
        });
    }
}

export async function action({ request }: Route.ActionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const formData = await request.formData();
    const id = formData.get("id")?.toString();
    const token = session.get("token");

    if (request.method == "DELETE" && token && id) {
        try {
            return data(await deleteWatchlistItem(id, token));
        } catch (error) {
            if (error instanceof AuthError) {
                return redirect("/login", {
                    headers: {
                        "Set-Cookie": await destroySession(session),
                    },
                });
            }
        }
    }
}

export default function Watchlist({ loaderData }: Route.ComponentProps) {
    const { watchlist, success } = loaderData;

    if (success && watchlist !== null) {
        const fetcher = useFetcher();
        const [chosenProviders, setChosenProviders] = useState<string[]>([]);
        const providers = useMemo(() => {
            const list: string[] = [];
            loaderData.watchlist.forEach((movie) => {
                movie.watch_providers.forEach((provider) => {
                    list.push(provider.name);
                });
            });
            return [...new Set(list)];
        }, [loaderData]);

        return (
            <div className="mb-4">
                <HeaderText text="Your Watchlist" />
                <DropDown
                    onChange={(values) => setChosenProviders(values)}
                    items={providers}
                />
                {watchlist
                    .filter((movie) =>
                        chosenProviders.length > 0
                            ? movie.watch_providers.some((provider) =>
                                  chosenProviders.some(
                                      (chosenProvider) =>
                                          provider.name == chosenProvider
                                  )
                              )
                            : true
                    )
                    .map((movie) => (
                        <div key={movie.id}>
                            <WatchlistCard
                                movie={movie}
                                onDelete={(id) =>
                                    fetcher.submit(
                                        { id: id },
                                        { method: "DELETE" }
                                    )
                                }
                            />
                        </div>
                    ))}
            </div>
        );
    } else {
        return <div>Unfortunately, something went wrong.</div>;
    }
}
