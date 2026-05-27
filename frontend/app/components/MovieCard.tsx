import type { APIMovie } from "~/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type MovieCardProps = {
    movie: APIMovie;
    onAddToWatchlist: (id: number) => void;
    onRemoveFromWatchlist: (id: string) => void;
};

export default function MovieCard({
    movie,
    onAddToWatchlist,
    onRemoveFromWatchlist,
}: MovieCardProps) {
    const onClick = () => {
        if (movie.in_watchlist && movie.watchlist_id) {
            onRemoveFromWatchlist(movie.watchlist_id);
        } else {
            onAddToWatchlist(movie.id);
        }
    };
    return (
        <div className="mx-4 p-2 border-b-2 border-pink-700">
            <div className="flex gap-4">
                <div className="text-xl">{movie.title}</div>
                <button onClick={onClick} className="p-1 rounded-md ml-auto">
                    {movie.in_watchlist ? (
                        <FontAwesomeIcon icon={["fas", "check"]} />
                    ) : (
                        <FontAwesomeIcon icon={["far", "circle"]} />
                    )}
                </button>
            </div>
            <div className="text-sm">{movie.overview}</div>
        </div>
    );
}
