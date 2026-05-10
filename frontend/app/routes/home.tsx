import SearchBar from "~/components/SearchBar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Movie Recommendations" }];
}

export default function Home() {
    return (
        <>
            <div className="p-[20px] flex md:flex-row justify-end gap-4 ">
                <p className="mr-auto">Movies</p>
                <button className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700">
                    Create Account
                </button>
                <button className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75">
                    Login
                </button>
            </div>
            <div className="flex flex-col items-center justify-center h-full">
                <SearchBar />
            </div>
        </>
    );
}
