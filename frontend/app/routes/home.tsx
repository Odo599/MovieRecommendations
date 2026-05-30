import type { Route } from "./+types/home";
import HomeLoggedIn from "~/pages/HomeLoggedIn";
import HomeLoggedOut from "~/pages/HomeLoggedOut";
import { getSession } from "~/lib/.server/sessions";
import { useLoaderData } from "react-router";

export function meta() {
    return [{ title: "Movie Recommendations" }];
}

export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    return {
        loggedIn: session.has("token"),
    };
}

export default function Home() {
    const { loggedIn } = useLoaderData<typeof loader>();
    if (!loggedIn) return <HomeLoggedOut />;
    else return <HomeLoggedIn />;
}
