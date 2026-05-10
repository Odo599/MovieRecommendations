import SearchBar from "~/components/SearchBar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Movie Recommendations" }];
}

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <SearchBar />
        </div>
    );
}
