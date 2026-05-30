import tmdbsimple as tmdb
import os
from dotenv import load_dotenv
import requests_cache
from pydantic import BaseModel

load_dotenv()
tmdb_api_key = os.getenv("TMDB_API_KEY")
session = requests_cache.CachedSession("tmdb_cache", use_cache_dir=True)

if tmdb_api_key == None:
    raise Exception("Need to set TMDB_API_KEY in .env")

tmdb.API_KEY = tmdb_api_key
tmdb.REQUESTS_SESSION = session


class MovieDetails(BaseModel):
    id: int
    overview: str
    release_date: str
    title: str


class MovieSearchInfo(BaseModel):
    id: int
    overview: str
    release_date: str
    title: str


class MovieSearchResults(BaseModel):
    page: int
    results: list[MovieSearchInfo]


class Provider(BaseModel):
    provider_id: int
    provider_name: str
    logo_path: str


class CountryWatchProviders(BaseModel):
    link: str
    flatrate: list[Provider] = []
    free: list[Provider] = []
    ads: list[Provider] = []


class MovieWatchProviders(BaseModel):
    id: int
    results: dict[str, CountryWatchProviders]


class PublicMovieWatchProvider(BaseModel):
    icon_path: str
    name: str
    availability_type: str


def get_movie_details(id: int):
    results = tmdb.Movies(id).info()
    return MovieDetails(**results)


def _clean_watch_providers(
    providers: CountryWatchProviders,
) -> list[PublicMovieWatchProvider]:
    mapping = {
        "Paramount+ Amazon Channel": "Paramount+",
        "Paramount Plus": "Paramount+",
        "Netflix Standard with Ads": "Netflix",
        "Amazon Prime Video": "Amazon Prime",
        "Amazon Prime Video with Ads": "Amazon Prime",
        "HBO Max Amazon Channel": "HBO Max",
        "Foxtel Now": "Foxtel",
        "SBS On Demand": "SBS",
    }
    result: list[PublicMovieWatchProvider] = []
    availability_type_lookup = ["flatrate", "free", "ads"]
    for index, plist in enumerate([providers.flatrate, providers.free, providers.ads]):
        for provider in plist:
            if provider.provider_name in mapping:
                name = mapping[provider.provider_name]
            else:
                name = provider.provider_name
            result.append(
                PublicMovieWatchProvider(
                    icon_path=provider.logo_path,
                    name=name,
                    availability_type=availability_type_lookup[index],
                )
            )
    seen = set()
    return [x for x in result if not (x.name in seen or seen.add(x.name))]


def get_movie_watch_providers(
    id: int, country_code: str
) -> list[PublicMovieWatchProvider]:
    results = MovieWatchProviders(**tmdb.Movies(id).watch_providers())
    if country_code in results.results:
        return _clean_watch_providers(results.results[country_code])
    return []


def search(query: str):
    results = tmdb.Search().movie(query=query)
    return MovieSearchResults(**results)
