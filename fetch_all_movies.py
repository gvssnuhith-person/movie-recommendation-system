import urllib.request
import urllib.parse
import json
import sqlite3
import time

API_KEY = "e54e1dc32fcc6a74b26ecfb041c2d3ca"
YEARS = range(2009, 2025)

GENRE_MAP = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
    53: "Thriller", 10752: "War", 37: "Western"
}

def run():
    print("Building local database using TMDB...")
    conn = sqlite3.connect("movies.db")
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS movies")
    cursor.execute("""
        CREATE TABLE movies (
            title TEXT,
            genre TEXT,
            language TEXT
        )
    """)
    
    total = 0
    # Let's bypass the proxies completely in python!
    # Python's urllib shouldn't be blocked by the ISP in the same way the browser is,
    # unless the ISP is actively packet sniffing.
    
    for lang in ['te', 'en']:
        for year in YEARS:
            print(f"Fetching {lang} movies for {year}...")
            for page in range(1, 3):
                url = f"https://api.themoviedb.org/3/discover/movie?api_key={API_KEY}&with_original_language={language}&primary_release_year={year}&sort_by=popularity.desc&page={page}"
                
                try:
                    # Let's try direct connection first, some ISPs only block DNS for browsers
                    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req, timeout=10) as response:
                        data = json.loads(response.read().decode())
                        
                        if 'results' not in data: continue
                        
                        for m in data['results']:
                            try:
                                genre_names = [GENRE_MAP.get(gid, "") for gid in m.get('genre_ids', [])]
                                genre_str = " ".join([g for g in genre_names if g])
                                language_str = 'Telugu' if lang == 'te' else 'English'
                                
                                cursor.execute("INSERT INTO movies VALUES (?, ?, ?)",
                                    (m['title'], genre_str, language_str))
                                total += 1
                            except: pass
                except Exception as e:
                    print(f"Error fetching direct TMDB for {year}: {e}")
                
                time.sleep(0.5)
                
    conn.commit()
    conn.close()
    print(f"DONE! Saved {total} movies to movies.db")

if __name__ == "__main__":
    run()
