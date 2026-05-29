from typing import Optional
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


class CountryWatchProviders(BaseModel):
    link: str
    flatrate: Optional[list[Provider]] = []


class MovieWatchProviders(BaseModel):
    id: int
    results: dict[str, CountryWatchProviders]


def get_movie_details(id: int):
    results = tmdb.Movies(id).info()
    return MovieDetails(**results)


def _clean_watch_providers(providers: list[Provider] | None) -> list[str]:
    if providers == None:
        return []
    mapping = {
        "Paramount+ Amazon Channel": "Paramount Plus",
        "Netflix Standard with Ads": "Netflix",
        "Amazon Prime Video with Ads": "Amazon Prime Video",
        "HBO Max Amazon Channel": "HBO Max",
    }
    result = []
    for provider in providers:
        if provider.provider_name in mapping:
            result.append(mapping[provider.provider_name])
        else:
            result.append(provider.provider_name)
    return list(set(result))


def get_movie_watch_providers(id: int, country_code: str):
    results = MovieWatchProviders(**tmdb.Movies(id).watch_providers())
    if country_code in results.results:
        return _clean_watch_providers(results.results[country_code].flatrate)
    return []


def search(query: str):
    results = tmdb.Search().movie(query=query)
    return MovieSearchResults(**results)
