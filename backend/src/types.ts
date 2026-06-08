import { Provider } from "./tmdb.js";

type PublicInfoBase = {
    id: number;
    overview: string;
    poster_path: string | null;
    watchlistId: string | null;
};

type PublicMovieInfo = {
    release_date: string;
    title: string;
    media_type: "movie";
} & PublicInfoBase;

type PublicTvShowInfo = {
    first_air_date: string;
    name: string;
    media_type: "tv";
} & PublicInfoBase;

type PublicWatchlistItemBase = {
    id: string;
    tmdbId: number;
    overview: string;
    watchProviders: Provider[];
    poster_path: string | null;
};

type PublicMovieWatchlistItem = {
    releaseDate: string;
    title: string;
    media_type: "movie";
} & PublicWatchlistItemBase;

type PublicTvWatchlistItem = {
    firstAirDate: string;
    name: string;
    media_type: "tv";
} & PublicWatchlistItemBase;

type PublicSearchResults = (PublicMovieInfo | PublicTvShowInfo)[];
type PublicWatchlist = (PublicMovieWatchlistItem | PublicTvWatchlistItem)[];

export { type PublicSearchResults, type PublicWatchlist };
