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

const APIWatchlistItem = z.object({
    id: z.string(),
    movie_id: z.number(),
    details: z.object({
        id: z.number(),
        overview: z.string(),
        release_date: z.string(),
        title: z.string(),
    }),
    watch_providers: z.array(z.string()),
});

const APIWatchlist = z.array(APIWatchlistItem);

type APIMovies = z.infer<typeof APIMovies>;
type APIMovie = z.infer<typeof APIMovie>;
type APIWatchlist = z.infer<typeof APIWatchlist>;
type APIWatchlistItem = z.infer<typeof APIWatchlistItem>;

export { APIMovies, APIMovie, APIWatchlist, APIWatchlistItem };
