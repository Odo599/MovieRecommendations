import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WatchProviderTags from "./WatchProviderTags";
import Poster from "./Poster";
import type { WatchlistItemSchema } from "~/lib/types";

type WatchlistCardProps = {
    item: WatchlistItemSchema;
    onDelete: () => void;
};

export default function WatchlistCard({ item, onDelete }: WatchlistCardProps) {
    return (
        <div className="mx-4 p-2 flex items-start border-b-1 border-gray-700">
            <Poster posterPath={item.poster_path} />
            <div className="flex-1">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 flex-1">
                        <div className="text-lg">
                            {item.media_type == "movie"
                                ? item.title
                                : item.name}
                            {(item.media_type === "movie"
                                ? item.releaseDate
                                : item.firstAirDate
                            ).length > 3 &&
                                ` (${(item.media_type === "movie" ? item.releaseDate : item.firstAirDate).slice(0, 4)})`}
                        </div>
                        <WatchProviderTags
                            watchProviders={item.watchProviders}
                        />
                    </div>
                    <button className="flex-shrink-0 pt-1" onClick={onDelete}>
                        <FontAwesomeIcon icon={["fas", "trash-can"]} />
                    </button>
                </div>
                <div className="text-sm mt-2">{item.overview}</div>
            </div>
        </div>
    );
}
