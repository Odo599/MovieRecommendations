import { useState } from "react";
import SearchIcon from "./SearchIcon";

type SearchBarProps = {
    onSubmit: (query: string) => void;
};

export default function SearchBar({ onSubmit }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleSubmit = (event: React.SubmitEvent) => {
        event.preventDefault();
        onSubmit(query);
    };

    return (
        <div className="w-full max-w-sm min-w-[200px]">
            <div className="relative">
                <form onSubmit={handleSubmit}>
                    <input
                        className="w-full bg-transparent placeholder:text-slate-400 dark:text-slate-100 text-sm border border-slate-400 dark:border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        placeholder="Search for a movie"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <button
                        className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="submit"
                        disabled={query == ""}
                    >
                        <SearchIcon />
                        Search
                    </button>
                </form>
            </div>
        </div>
    );
}
