import * as z from "zod";

const APIMovie = z.object({
    id: z.number(),
    overview: z.string(),
    release_date: z.string(),
    title: z.string(),
    inWatchlist: z.boolean(),
    watchlistId: z.string().nullable(),
});

const APIMovies = z.array(APIMovie);

const APIWatchProvider = z.object({
    iconPath: z.string(),
    name: z.string(),
    type: z.string(),
});

const APIWatchlistItem = z.object({
    id: z.string(),
    movieId: z.number(),
    overview: z.string(),
    releaseDate: z.string(),
    title: z.string(),
    watchProviders: z.array(APIWatchProvider),
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
