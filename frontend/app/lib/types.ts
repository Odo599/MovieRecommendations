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

type APIMovies = z.infer<typeof APIMovies>;
type APIMovie = z.infer<typeof APIMovie>;

export { APIMovies, APIMovie };
