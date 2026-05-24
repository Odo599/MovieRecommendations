import tmdbsimple as tmdb
import os
from dotenv import load_dotenv
import requests_cache

load_dotenv()
tmdb_api_key = os.getenv("TMDB_API_KEY")
session = requests_cache.CachedSession("tmdb_cache", use_cache_dir=True)

if tmdb_api_key == None:
    raise Exception("Need to set TMDB_API_KEY in .env")

tmdb.API_KEY = tmdb_api_key
tmdb.REQUESTS_SESSION = session


def get_movie_details(id: int):
    return tmdb.Movies(id).info()


def search(query: str):
    return tmdb.Search().movie(query=query)
