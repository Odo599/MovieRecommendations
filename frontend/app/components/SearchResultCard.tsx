import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Poster from "./Poster";
import type { SearchResultSchema } from "~/lib/types";

type SearchResultCardProps = {
    item: SearchResultSchema;
    onAddToWatchlist: (id: number) => void;
    onRemoveFromWatchlist: (id: string) => void;
};

export default function SearchResultCard({
    item,
    onAddToWatchlist,
    onRemoveFromWatchlist,
}: SearchResultCardProps) {
    const onClick = () => {
        if (item.watchlistId) {
            onRemoveFromWatchlist(item.watchlistId);
        } else {
            onAddToWatchlist(item.id);
        }
    };
    return (
        <div className="mx-4 p-2 flex items-start border-b-1 border-gray-700">
            <Poster posterPath={item.poster_path} />
            <div className="flex-1">
                <div className="flex gap-4">
                    <div className="text-xl">
                        {item.media_type == "movie" ? item.title : item.name}
                        {(item.media_type == "movie"
                            ? item.release_date
                            : item.first_air_date
                        ).length > 3 &&
                            ` (${(item.media_type == "movie" ? item.release_date : item.first_air_date).slice(0, 4)})`}
                    </div>
                    <button
                        onClick={onClick}
                        className="p-1 rounded-md ml-auto"
                    >
                        {item.watchlistId ? (
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
                <div className="text-sm">{item.overview}</div>
            </div>
        </div>
    );
}
