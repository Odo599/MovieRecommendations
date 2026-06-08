import type { APIMovie } from "~/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MoviePoster from "./MoviePoster";

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
        <div className="mx-4 p-2 flex items-start border-b-1 border-gray-700">
            <MoviePoster posterPath={movie.poster_path} />
            <div className="flex-1">
                <div className="flex gap-4">
                    <div className="text-xl">
                        {movie.title}
                        {movie.release_date.length > 3 &&
                            ` (${movie.release_date.slice(0, 4)})`}
                    </div>
                    <button
                        onClick={onClick}
                        className="p-1 rounded-md ml-auto"
                    >
                        {movie.inWatchlist ? (
                            <FontAwesomeIcon
                                height={16}
                                icon={["fas", "check"]}
                            />
                        ) : (
                            <FontAwesomeIcon
                                height={16}
                                icon={["far", "circle"]}
                            />
                        )}
                    </button>
                </div>
                <div className="text-sm">{movie.overview}</div>
            </div>
        </div>
    );
}
