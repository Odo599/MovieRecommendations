import * as z from "zod";

const APIMovie = z.object({
    genre_ids: z.array(z.number()),
    id: z.number(),
    overview: z.string(),
    release_date: z.string(),
    title: z.string(),
});

const APIMovies = z.object({
    page: z.number(),
    results: z.array(APIMovie),
});

const APIWatchlistItem = z.object({
    id: z.string(),
    movie_id: z.number(),
});

const APIWatchlist = z.array(APIWatchlistItem);

type APIMovies = z.infer<typeof APIMovies>;
type APIMovie = z.infer<typeof APIMovie>;
type APIWatchlist = z.infer<typeof APIWatchlist>;
type APIWatchlistItem = z.infer<typeof APIWatchlistItem>;

export { APIMovies, APIMovie, APIWatchlist, APIWatchlistItem };
