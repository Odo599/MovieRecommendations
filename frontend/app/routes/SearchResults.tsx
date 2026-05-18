import type { Route } from "./+types/SearchResults";

export function meta({}: Route.MetaArgs) {
    // todo show search query in title
    return [{ title: "Movie Recommendations" }];
}

export async function loader({ params }: Route.LoaderArgs) {
    return params.query;
}

export default function SearchResults({ loaderData }: Route.ComponentProps) {
    return <div>todo code search results {loaderData?.toString()}</div>;
}
