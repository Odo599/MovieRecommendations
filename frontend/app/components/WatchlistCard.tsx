import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { APIWatchlistItem } from "~/lib/types";
import WatchProviderTags from "./WatchProviderTags";

type WatchlistCardProps = {
    movie: APIWatchlistItem;
    onDelete: (id: string) => void;
};

export default function WatchlistCard({ movie, onDelete }: WatchlistCardProps) {
    const _onDelete = () => onDelete(movie.id);
    return (
        <div className="mx-4 p-2 border-b-2 border-pink-700">
            <div className="flex gap-4">
                <div className="text-xl">{movie.title}</div>
                <WatchProviderTags watchProviders={movie.watchProviders} />
                <button className="ml-auto" onClick={_onDelete}>
                    <FontAwesomeIcon icon={["fas", "trash-can"]} />
                </button>
            </div>
            <div className="text-sm">{movie.overview}</div>
        </div>
    );
}
