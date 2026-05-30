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
        if (movie.inWatchlist && movie.watchlistId) {
            onRemoveFromWatchlist(movie.watchlistId);
        } else {
            onAddToWatchlist(movie.id);
        }
    };
    return (
        <div className="mx-4 p-2 border-b-2 border-pink-700">
            <div className="flex gap-4">
                <div className="text-xl">{movie.title}</div>
                <button onClick={onClick} className="p-1 rounded-md ml-auto">
                    {movie.inWatchlist ? (
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
