import {
    destroySession,
    getSession,
    commitSession,
} from "~/lib/.server/sessions";
import type { Route } from "./+types/SearchResults";
import { data, redirect, useFetcher } from "react-router";
import search from "~/lib/.server/search";
import { AuthError } from "~/lib/errors";
import { APIMovies } from "~/lib/types";
import MovieCard from "~/components/MovieCard";
import addWatchlistItem from "~/lib/.server/addWatchlistItem";
import deleteWatchlistItem from "~/lib/.server/deleteWatchlistItem";
import HeaderText from "~/components/HeaderText";

export function meta() {
    // todo show search query in title
    return [{ title: "Movie Recommendations" }];
}

interface LoaderSuccess {
    query: string;
    results: APIMovies;
}

function isLoaderSuccess(obj: unknown): obj is LoaderSuccess {
    return (
        obj !== null &&
        typeof obj === "object" &&
        "query" in obj &&
        "results" in obj
    );
}

export async function loader({ params, request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.has("token") || params.query == undefined) {
        return redirect("/");
    }
    const token = session.get("token");
    if (token == undefined) return redirect("/");
    try {
        const results = await search(params.query, token);
        return data(
            {
                query: params.query,
                results: results,
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
        } else {
            return data({
                error: JSON.stringify("An unknown error happenend"),
            });
        }
    }
}

export async function action({ request }: Route.ActionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const formData = await request.formData();
    const id = formData.get("id")?.toString();
    const action = formData.get("action")?.toString();
    const query = formData.get("query")?.toString();
    const token = session.get("token");
    if (id && token && query) {
        if (action == "add_to_watchlist" && !isNaN(Number(id))) {
            await addWatchlistItem(Number(id), token);
        } else if (action == "remove_from_watchlist") {
            await deleteWatchlistItem(id, token);
        }
        return await search(query, token);
    }
}

export default function SearchResults({ loaderData }: Route.ComponentProps) {
    if (isLoaderSuccess(loaderData)) {
        const { results, query } = loaderData;
        const addFetcher = useFetcher();
        const removeFetcher = useFetcher();

        return (
            <div className="mb-4">
                <HeaderText text={`Search results for ${query}.`} />
                {results.map((movie) => {
                    return (
                        <div key={movie.id}>
                            <MovieCard
                                movie={movie}
                                onAddToWatchlist={(id) => {
                                    addFetcher.submit(
                                        {
                                            id: id,
                                            action: "add_to_watchlist",
                                            query: query,
                                        },
                                        { method: "POST" }
                                    );
                                }}
                                onRemoveFromWatchlist={(id) => {
                                    removeFetcher.submit(
                                        {
                                            id: id,
                                            action: "remove_from_watchlist",
                                            query: query,
                                        },
                                        { method: "DELETE" }
                                    );
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        );
    } else {
        return <div>{loaderData.error}</div>;
    }
}
