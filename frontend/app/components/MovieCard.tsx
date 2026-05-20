import { Link } from "react-router";
import type { APIMovie } from "~/lib/types";

type MovieCardProps = {
    movie: APIMovie;
    showSimilarLink: boolean;
};

export default function MovieCard({ movie, showSimilarLink }: MovieCardProps) {
    return (
        <div className="m-4 p-2 border-2 border-pink-700 rounded-lg">
            <div className="flex gap-4">
                <div className="text-xl">{movie.title}</div>
                {showSimilarLink && (
                    <Link
                        to={`/similar/${movie.id}`}
                        className="p-1 border border-pink-500 rounded-md"
                    >
                        Similar
                    </Link>
                )}
            </div>
            <div className="text-sm">{movie.overview}</div>
        </div>
    );
}
