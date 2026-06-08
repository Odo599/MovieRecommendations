import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { APIWatchlistItem } from "~/lib/types";
import WatchProviderTags from "./WatchProviderTags";
import MoviePoster from "./MoviePoster";

type WatchlistCardProps = {
    movie: APIWatchlistItem;
    onDelete: (id: string) => void;
};

export default function WatchlistCard({ movie, onDelete }: WatchlistCardProps) {
    const _onDelete = () => onDelete(movie.id);
    return (
        <div className="mx-4 p-2 flex items-start border-b-1 border-gray-700">
            <MoviePoster posterPath={movie.poster_path} />
            <div className="flex-1">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 flex-1">
                        <div className="text-lg">
                            {movie.title}
                            {movie.releaseDate.length > 3 &&
                                ` (${movie.releaseDate.slice(0, 4)})`}
                        </div>
                        <WatchProviderTags
                            watchProviders={movie.watchProviders}
                        />
                    </div>
                    <button className="flex-shrink-0 pt-1" onClick={_onDelete}>
                        <FontAwesomeIcon icon={["fas", "trash-can"]} />
                    </button>
                </div>
                <div className="text-sm mt-2">{movie.overview}</div>
            </div>
        </div>
    );
}
