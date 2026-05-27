from sqlalchemy.engine import result
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


def get_movie_details(id: int):
    results = tmdb.Movies(id).info()
    return MovieDetails(**results)


def search(query: str):
    results = tmdb.Search().movie(query=query)
    return MovieSearchResults(**results)
