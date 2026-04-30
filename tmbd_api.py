import tmdbsimple as tmdb
import os
from dotenv import load_dotenv

load_dotenv()

tmdb_api_key = os.getenv("TMDB_API_KEY")
if tmdb_api_key == None:
    raise Exception("Need to set TMDB_API_KEY in .env")

def get_movie_details(id: int):
    return tmdb.Movies(id).info() 

def get_similar_movies(id: int):
    return tmdb.Movies(id).similar_movies()

