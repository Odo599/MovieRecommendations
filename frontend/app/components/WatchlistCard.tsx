import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { APIWatchlistItem } from "~/lib/types";

type WatchlistCardProps = {
    movie: APIWatchlistItem;
    onDelete: (id: string) => void;
};

export default function WatchlistCard({ movie, onDelete }: WatchlistCardProps) {
    const _onDelete = () => onDelete(movie.id);
    return (
        <div className="m-4 p-2 border-2 border-pink-700 rounded-lg">
            <div className="flex gap-4">
                <div className="text-xl">{movie.details.title}</div>
                <button className="ml-auto" onClick={_onDelete}>
                    <FontAwesomeIcon icon={["fas", "trash-can"]} />
                </button>
            </div>
            <div className="text-sm">{movie.details.overview}</div>
        </div>
    );
}
