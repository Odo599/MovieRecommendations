import { Link, useNavigate } from "react-router";
import SearchBar from "~/components/SearchBar";

export default function HomeLoggedIn() {
    const navigate = useNavigate();
    const onSearch = (query: string) => {
        if (query !== "") {
            navigate(`/search/${query}`);
        } else {
            console.warn("tried to search without a query");
        }
    };

    return (
        <>
            <div className="p-[20px] flex md:flex-row justify-end gap-4 ">
                <p className="mr-auto">Movies</p>
                <Link
                    to={"/watchlist"}
                    prefix="intent"
                    viewTransition
                    className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                >
                    Watchlist
                </Link>
            </div>
            <div className="flex flex-col items-center h-screen">
                <SearchBar onSubmit={onSearch} />
            </div>
        </>
    );
}
