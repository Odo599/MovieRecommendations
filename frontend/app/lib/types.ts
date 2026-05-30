import * as z from "zod";

const APIMovie = z.object({
    id: z.number(),
    overview: z.string(),
    release_date: z.string(),
    title: z.string(),
    in_watchlist: z.boolean(),
    watchlist_id: z.string().nullable(),
});

const APIMovies = z.array(APIMovie);

const APIWatchProvider = z.object({
    icon_path: z.string(),
    name: z.string(),
    availability_type: z.string(),
});

const APIWatchlistItem = z.object({
    id: z.string(),
    movie_id: z.number(),
    details: z.object({
        id: z.number(),
        overview: z.string(),
        release_date: z.string(),
        title: z.string(),
    }),
    watch_providers: z.array(APIWatchProvider),
});

const APIWatchlist = z.array(APIWatchlistItem);

type APIMovies = z.infer<typeof APIMovies>;
type APIMovie = z.infer<typeof APIMovie>;
type APIWatchProvider = z.infer<typeof APIWatchProvider>;
type APIWatchlist = z.infer<typeof APIWatchlist>;
type APIWatchlistItem = z.infer<typeof APIWatchlistItem>;

export {
    APIMovies,
    APIMovie,
    APIWatchProvider,
    APIWatchlist,
    APIWatchlistItem,
};
