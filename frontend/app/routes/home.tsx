import type { Route } from "./+types/home";
import { useLocalStorage } from "usehooks-ts";
import HomeLoggedIn from "~/pages/HomeLoggedIn";
import HomeLoggedOut from "~/pages/HomeLoggedOut";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Movie Recommendations" }];
}

export default function Home() {
    const [loggedIn] = useLocalStorage<boolean>(
        "logged_in",
        false
    );

    if (!loggedIn) return <HomeLoggedOut />
    else return <HomeLoggedIn/>

}
