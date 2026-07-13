import sqlite3
import pandas as pd
import os

db_path = "movies.db"
print("Initializing database...")

if os.path.exists(db_path):
    os.remove(db_path)

# 1. Load existing movies from CSV if available (which might have 10 or 9700 movies)
try:
    df = pd.read_csv("movies.csv")
    if 'language' not in df.columns:
        df['language'] = "English" # Default existing ones to English
    print(f"Loaded {len(df)} movies from movies.csv")
except Exception as e:
    print(f"Could not load movies.csv (starting fresh): {e}")
    df = pd.DataFrame(columns=["title", "genre", "language"])

# 2. Add an awesome list of Telugu Movies
telugu_movies = [
    {"title": "Baahubali: The Beginning", "genre": "Action Adventure Drama", "language": "Telugu"},
    {"title": "Baahubali 2: The Conclusion", "genre": "Action Adventure Fantasy", "language": "Telugu"},
    {"title": "RRR", "genre": "Action Drama Epic", "language": "Telugu"},
    {"title": "Pushpa: The Rise", "genre": "Action Crime Thriller", "language": "Telugu"},
    {"title": "Ala Vaikunthapurramuloo", "genre": "Action Comedy Drama", "language": "Telugu"},
    {"title": "Arjun Reddy", "genre": "Action Romance Drama", "language": "Telugu"},
    {"title": "Eega", "genre": "Action Fantasy Comedy", "language": "Telugu"},
    {"title": "Mahanati", "genre": "Biography Drama", "language": "Telugu"},
    {"title": "Jersey", "genre": "Sports Drama", "language": "Telugu"},
    {"title": "Sita Ramam", "genre": "Romance Drama", "language": "Telugu"},
    {"title": "Kalki 2898 AD", "genre": "Sci-Fi Action Epic", "language": "Telugu"},
    {"title": "Salaar", "genre": "Action Crime Thriller", "language": "Telugu"},
    {"title": "Magadheera", "genre": "Action Fantasy Romance", "language": "Telugu"},
    {"title": "Rangasthalam", "genre": "Action Drama", "language": "Telugu"},
    {"title": "K.G.F: Chapter 1", "genre": "Action Crime", "language": "Telugu"},
    {"title": "Hanuman", "genre": "Action Superhero Fantasy", "language": "Telugu"},
    {"title": "Devara", "genre": "Action Thriller", "language": "Telugu"}
]

telugu_df = pd.DataFrame(telugu_movies)

# 3. Combine them together
combined_df = pd.concat([df, telugu_df], ignore_index=True)

# 4. Remove exact duplicates (if you run this multiple times)
combined_df = combined_df.drop_duplicates(subset=["title"])

# 5. Save to an actual SQLite Database
conn = sqlite3.connect(db_path)
combined_df.to_sql("movies", conn, if_exists="replace", index=False)
conn.close()

print("=========================================")
print(f"SUCCESS! Created SQLite Database: {db_path}")
print(f"Total Movies in Database: {len(combined_df)}")
print(f"Included {len(telugu_df)} Telugu blockbusters!")
print("=========================================")