from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sqlite3
import os

app = FastAPI(title="Movie Recommendation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for the ML model
df = None
vectorizer = None
feature_vectors = None
similarity = None
movie_list = []

def load_data():
    global df, vectorizer, feature_vectors, similarity, movie_list
    db_path = "movies.db"
    
    try:
        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            df = pd.read_sql_query("SELECT * FROM movies", conn)
            conn.close()
            print(f"Loaded {len(df)} movies from SQLite Database!")
        else:
            # Fallback to CSV if DB doesn't exist
            df = pd.read_csv("movies.csv")
            if 'language' not in df.columns:
                df['language'] = 'English'
            print(f"Loaded {len(df)} movies from CSV!")

        # Drop duplicates and NaNs
        df = df.drop_duplicates(subset=['title'])
        df['genre'] = df['genre'].fillna('')
        
        # We can combine genre and language to make recommendations stick to similar languages if wanted
        # But for now, we'll just train on genre as requested previously
        vectorizer = TfidfVectorizer(stop_words='english')
        feature_vectors = vectorizer.fit_transform(df["genre"])
        similarity = cosine_similarity(feature_vectors)

        movie_list = df["title"].str.lower().tolist()
        return True
    except Exception as e:
        print(f"Error loading data: {e}")
        df = None
        return False

# Load on startup
load_data()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Movie Recommendation API"}

@app.get("/movies")
def get_all_movies(language: str = "All"):
    if df is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
        
    if language != "All":
        filtered = df[df['language'] == language]
        return {"movies": filtered["title"].tolist()}
        
    return {"movies": df["title"].tolist()}

@app.get("/recommend")
def recommend_movie(movie: str):
    try:
        if df is None:
            raise HTTPException(status_code=500, detail="Data not loaded.")

        search_term = movie.lower().strip()

        if search_term not in movie_list:
            matches = [m for m in movie_list if search_term in m]
            if not matches:
                raise HTTPException(status_code=404, detail="Movie not found in dataset. Try another movie.")
            search_term = matches[0]

        index = movie_list.index(search_term)
        similarity_scores = list(enumerate(similarity[index]))

        sorted_movies = sorted(
            similarity_scores,
            key=lambda x: x[1],
            reverse=True
        )

        recommendations = []
        for m in sorted_movies[1:7]: # Top 6 recommendations
            movie_index = m[0]
            recommendations.append({
                "title": df.iloc[movie_index]["title"],
                "genre": df.iloc[movie_index]["genre"],
                "language": df.iloc[movie_index].get("language", "Unknown")
            })

        return {
            "searched_movie": df.iloc[index]["title"],
            "recommendations": recommendations
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/reload")
def reload_database():
    """Endpoint to trigger a reload of the ML model after fetching new movies"""
    success = load_data()
    if success:
        return {"message": f"Successfully reloaded model with {len(df)} movies"}
    raise HTTPException(status_code=500, detail="Failed to reload data")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
