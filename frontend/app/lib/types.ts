import * as z from "zod";

const WatchProviderSchema = z.object({
    iconPath: z.string(),
    name: z.string(),
    type: z.string(),
});

const SearchItemBaseSchema = z.object({
    id: z.number(),
    overview: z.string(),
    poster_path: z.string().nullable(),
    watchlistId: z.string().nullable(),
});

const MovieSchema = SearchItemBaseSchema.extend({
    release_date: z.string(),
    title: z.string(),
    media_type: z.literal("movie"),
});

const TvShowSchema = SearchItemBaseSchema.extend({
    first_air_date: z.string(),
    name: z.string(),
    media_type: z.literal("tv"),
});

const WatchlistItemBaseSchema = z.object({
    id: z.string(),
    tmdbId: z.number(),
    overview: z.string(),
    watchProviders: z.array(WatchProviderSchema),
    poster_path: z.string().nullable(),
});

const WatchlistItemMovieSchema = WatchlistItemBaseSchema.extend({
    media_type: z.literal("movie"),
    releaseDate: z.string(),
    title: z.string(),
});

const WatchlistItemTvSchema = WatchlistItemBaseSchema.extend({
    media_type: z.literal("tv"),
    firstAirDate: z.string(),
    name: z.string(),
});

const SearchResultSchema = MovieSchema.or(TvShowSchema);
const SearchResultsSchema = z.array(SearchResultSchema);

const WatchlistItemSchema = WatchlistItemMovieSchema.or(WatchlistItemTvSchema);
const WatchlistSchema = z.array(WatchlistItemSchema);

type WatchProviderSchema = z.infer<typeof WatchProviderSchema>;

type SearchResultSchema = z.infer<typeof SearchResultSchema>;
type SearchResultsSchema = z.infer<typeof SearchResultsSchema>;
type WatchlistItemSchema = z.infer<typeof WatchlistItemSchema>;
type WatchlistSchema = z.infer<typeof WatchlistSchema>;

export {
    SearchResultSchema,
    SearchResultsSchema,
    WatchlistItemSchema,
    WatchlistSchema,
    WatchProviderSchema,
};
