# CineMatch - Movie Recommendation System
## Complete Project Documentation

### 1. Project Overview
CineMatch is a modern, full-stack Movie Recommendation System. It uses Machine Learning (TF-IDF and Cosine Similarity) to recommend movies based on genre similarities. It features a highly interactive 3D frontend, dynamic search, multi-language filtering (English & Telugu), and automatic fallback data retrieval (OMDB API & Wikipedia API) for rich movie details.

### 2. Technology Stack
*   **Frontend**: React, Vite, TailwindCSS, Framer Motion (Animations), Three.js / React Three Fiber (3D Elements).
*   **Backend**: Python, FastAPI, Uvicorn, Pandas, Scikit-learn (Machine Learning).
*   **Database**: SQLite (`movies.db`).
*   **APIs**: OMDB API (Primary movie details), Wikipedia REST API (Fallback data).
*   **Deployment**: Vercel (Frontend), Render (Backend).

### 3. Backend Architecture (Python / FastAPI)
*   `app.py`: The core server file. It loads the SQLite database on startup, vectorizes the genres using `TfidfVectorizer`, and computes a Cosine Similarity matrix. It exposes endpoints `/movies` for the frontend dropdown and `/recommend` to fetch the top 6 similar movies.
*   `requirements.txt`: Python dependencies including fastapi, uvicorn, pandas, and scikit-learn.
*   `render.yaml`: CI/CD configuration to automatically deploy the FastAPI server to Render.com.

### 4. Frontend Architecture (React / Vite)
*   `frontend/src/App.jsx`: The main application view. Handles user search input, communicates with the Python backend, filters by language, and triggers entrance animations for movie cards using Framer Motion.
*   `frontend/src/components/Scene.jsx`: Creates the immersive 3D background. Uses Three.js floating octahedrons with a parallax effect tied to mouse movements.
*   `frontend/src/components/MovieModal.jsx`: A cinematic popup that queries OMDB (and Wikipedia as a fallback) to retrieve and display movie posters, plots, ratings, and runtime dynamically.

### 5. Data Pipeline & Database
*   `fetch_all_movies.py`: An automated data pipeline script that pulls the top movies from the past 15 years from TMDB (via proxy to bypass ISP blocks) and writes them to the SQLite database.
*   `generate_movies.py` & `setup_db.py`: Secondary scripts used to curate a high-quality list of top-tier Telugu and English movies to ensure highly accurate recommendations.
*   `movies.db`: The resulting local SQLite database powering the system.

### 6. Deployment URLs
*   **Live Frontend URL**: https://movierecomended.vercel.app
*   **Live Backend URL**: https://movie-recommendation-system-d6qr.onrender.com

When users interact with the Vercel site, API calls are securely routed to the Render backend to calculate recommendations, which are then enriched with IMDB/Wikipedia data directly in the browser.