import { moviedb } from "./index.js";
import * as z from "zod";
import { CacheContainer } from "node-ts-cache";
import { IoRedisStorage } from "node-ts-cache-storage-ioredis";
import IoRedis from "ioredis";
import { config } from "./config.js";

const ioRedisInstance = new IoRedis({
    port: 6379,
    host: config.REDIS_HOST,
    family: 4,
    password: config.REDIS_PASSWORD,
    db: 0,
});

const tmdbCache = new CacheContainer(new IoRedisStorage(ioRedisInstance));

const MovieInfo = z.object({
    id: z.number(),
    overview: z.string(),
    release_date: z.string(),
    title: z.string(),
});

const MovieSearchResults = z.object({
    page: z.number(),
    results: z.array(MovieInfo),
});

const _Provider = z.object({
    provider_id: z.number(),
    provider_name: z.string(),
    logo_path: z.string(),
});

const CountryWatchProviders = z.object({
    link: z.string(),
    flatrate: z.array(_Provider).optional(),
    free: z.array(_Provider).optional(),
    ads: z.array(_Provider).optional(),
});

const MovieWatchProviders = z.object({
    id: z.number(),
    results: z.record(z.string(), CountryWatchProviders),
});

const Provider = z.object({
    iconPath: z.string(),
    name: z.string(),
    type: z.string(),
});

type MovieInfo = z.infer<typeof MovieInfo>;
type MovieSearchResults = z.infer<typeof MovieSearchResults>;
type CountryWatchProviders = z.infer<typeof CountryWatchProviders>;
type Provider = z.infer<typeof Provider>;

export { Provider };

export async function searchTmdb(query: string): Promise<MovieSearchResults> {
    type MovieResultsResponse = Awaited<ReturnType<typeof moviedb.searchMovie>>;

    const cacheKey = `search:${query}`;
    const cached = await tmdbCache.getItem<MovieResultsResponse>(cacheKey);

    let results: MovieResultsResponse;
    if (cached) {
        results = cached;
    } else {
        console.log(`no cached value for ${cacheKey}`);
        results = await moviedb.searchMovie({ query: query });
        await tmdbCache.setItem(cacheKey, results, { ttl: 3600 });
    }
    return MovieSearchResults.parse(results);
}

export async function getMovieInfo(id: number) {
    type MovieResponse = Awaited<ReturnType<typeof moviedb.movieInfo>>;

    const cacheKey = `movieInfo:${id}`;
    const cached = await tmdbCache.getItem<MovieResponse>(cacheKey);

    let results: MovieResponse;
    if (cached) {
        results = cached;
    } else {
        console.log(`no cached value for ${cacheKey}`);
        results = await moviedb.movieInfo({ id: id });
        await tmdbCache.setItem(cacheKey, results, { ttl: 3600 });
    }
    return MovieInfo.parse(results);
}

function _cleanWatchProviders(providers: CountryWatchProviders) {
    const mapping = new Map([
        ["Paramount+ Amazon Channel", "Paramount+"],
        ["Paramount Plus", "Paramount+"],
        ["Netflix Standard with Ads", "Netflix"],
        ["Amazon Prime Video", "Amazon Prime"],
        ["Amazon Prime Video with Ads", "Amazon Prime"],
        ["HBO Max Amazon Channel", "HBO Max"],
        ["Foxtel Now", "Foxtel"],
        ["SBS On Demand", "SBS"],
    ]);

    const results: Provider[] = [];
    const typeLookup = ["flatrate", "free", "ads"];

    const providerList = [providers.flatrate, providers.free, providers.ads];
    providerList.forEach((plist, index) => {
        plist?.forEach((p) => {
            const name = mapping.get(p.provider_name) ?? p.provider_name;
            results.push({
                iconPath: p.logo_path,
                name: name,
                type: typeLookup[index]!,
            });
        });
    });

    const seen = new Set();
    return results.filter((movie) => {
        if (seen.has(movie.name)) return false;
        seen.add(movie.name);
        return true;
    });
}

export async function getMovieWatchProviders(id: number, countryCode: string) {
    type WatchProviderResponse = Awaited<
        ReturnType<typeof moviedb.movieWatchProviders>
    >;

    const cacheKey = `movieWatchProviders:${id}`;
    const cached = await tmdbCache.getItem<WatchProviderResponse>(cacheKey);
    let results: WatchProviderResponse;
    if (cached) {
        results = cached;
    } else {
        results = await moviedb.movieWatchProviders({ id: id });
        await tmdbCache.setItem(cacheKey, results, { ttl: 3600 });
    }
    const parsed = MovieWatchProviders.parse(results);
    if (countryCode in parsed.results) {
        return _cleanWatchProviders(parsed.results[countryCode]!);
    }
    return [];
}
