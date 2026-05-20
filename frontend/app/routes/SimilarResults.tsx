import { destroySession, getSession } from "~/lib/sessions.server";
import type { Route } from "./+types/SimilarResults";
import { data, Navigate, redirect } from "react-router";
import { commitSession } from "~/lib/sessions.server";
import { AuthError } from "~/lib/errors";
import type { APIMovies } from "~/lib/types";
import MovieCard from "~/components/MovieCard";
import similar from "~/lib/similar";

export function meta({}: Route.MetaArgs) {
    // todo show search query in title
    return [{ title: "Movie Recommendations" }];
}

interface LoaderSuccess {
    query: string;
    results: APIMovies;
}

function isLoaderSuccess(obj: any): obj is LoaderSuccess {
    return (
        obj !== null &&
        typeof obj === "object" &&
        "query" in obj &&
        "results" in obj
    );
}

export async function loader({ params, request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.has("token") || params.id == undefined) {
        return redirect("/");
    }
    const token = session.get("token");
    const id = Number(params.id);
    if (token == undefined || Number.isNaN(id)) return redirect("/");
    try {
        const results = await similar(id, token);
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

export default function SearchResults({ loaderData }: Route.ComponentProps) {
    if (isLoaderSuccess(loaderData)) {
        const { results } = loaderData;
        return (
            <div>
                {results.results.map((movie) => {
                    return (
                        <div key={movie.id}>
                            <MovieCard movie={movie} showSimilarLink={false}/>
                        </div>
                    );
                })}
            </div>
        );
    } else {
        return <Navigate to={"/"} replace={true} />;
    }
}
