import sqlite3

# Massive hardcoded list of amazing English and Telugu movies to bypass all API issues completely!
movies = [
    # TELUGU
    ("Baahubali: The Beginning", "Action Adventure Drama", "Telugu"),
    ("Baahubali 2: The Conclusion", "Action Adventure Fantasy", "Telugu"),
    ("RRR", "Action Drama Epic", "Telugu"),
    ("Pushpa: The Rise", "Action Crime Thriller", "Telugu"),
    ("Ala Vaikunthapurramuloo", "Action Comedy Drama", "Telugu"),
    ("Arjun Reddy", "Action Romance Drama", "Telugu"),
    ("Eega", "Action Fantasy Comedy", "Telugu"),
    ("Mahanati", "Biography Drama", "Telugu"),
    ("Jersey", "Sports Drama", "Telugu"),
    ("Sita Ramam", "Romance Drama", "Telugu"),
    ("Kalki 2898 AD", "Sci-Fi Action Epic", "Telugu"),
    ("Salaar", "Action Crime Thriller", "Telugu"),
    ("Magadheera", "Action Fantasy Romance", "Telugu"),
    ("Rangasthalam", "Action Drama", "Telugu"),
    ("Hanuman", "Action Superhero Fantasy", "Telugu"),
    ("Devara", "Action Thriller", "Telugu"),
    ("Geetha Govindam", "Romance Comedy", "Telugu"),
    ("Fidaa", "Romance Drama", "Telugu"),
    ("Srimanthudu", "Action Drama", "Telugu"),
    ("Janatha Garage", "Action Drama", "Telugu"),
    ("Arya", "Romance Action", "Telugu"),
    ("Arya 2", "Romance Action", "Telugu"),
    ("Bommarillu", "Romance Family", "Telugu"),
    ("Pokiri", "Action Crime Thriller", "Telugu"),
    ("Athadu", "Action Thriller", "Telugu"),
    ("Khaleja", "Action Comedy", "Telugu"),
    ("Okkadu", "Action Drama", "Telugu"),
    ("Chatrapathi", "Action Drama", "Telugu"),
    ("Vikramarkudu", "Action Comedy", "Telugu"),
    ("Arundhati", "Horror Fantasy", "Telugu"),
    ("Bhaagamathie", "Horror Thriller", "Telugu"),
    ("Mathu Vadalara", "Comedy Thriller", "Telugu"),
    ("Kshanam", "Mystery Thriller", "Telugu"),
    ("Goodachari", "Action Spy Thriller", "Telugu"),
    ("Evaru", "Crime Thriller", "Telugu"),
    ("HIT: The First Case", "Crime Thriller", "Telugu"),
    ("HIT: The Second Case", "Crime Thriller", "Telugu"),
    ("DJ Tillu", "Comedy Crime", "Telugu"),
    ("Tillu Square", "Comedy Crime", "Telugu"),
    ("Dasara", "Action Drama", "Telugu"),
    ("Hi Nanna", "Romance Drama Family", "Telugu"),
    ("Miss Shetty Mr Polishetty", "Comedy Romance", "Telugu"),
    ("C/o Kancharapalem", "Drama Romance", "Telugu"),
    ("Pelli Choopulu", "Comedy Romance", "Telugu"),
    ("Bimbisara", "Fantasy Action", "Telugu"),
    ("Karthikeya 2", "Mystery Adventure", "Telugu"),
    ("Virupaksha", "Horror Mystery", "Telugu"),
    ("Sye Raa Narasimha Reddy", "Action History Drama", "Telugu"),
    ("Guntur Kaaram", "Action Family", "Telugu"),
    ("Bhagavanth Kesari", "Action Drama", "Telugu"),

    # ENGLISH
    ("Inception", "Action Sci-Fi Thriller", "English"),
    ("Interstellar", "Adventure Drama Sci-Fi", "English"),
    ("The Dark Knight", "Action Crime Drama", "English"),
    ("The Matrix", "Action Sci-Fi", "English"),
    ("Avatar", "Action Adventure Fantasy", "English"),
    ("Avengers: Endgame", "Action Adventure Sci-Fi", "English"),
    ("Avengers: Infinity War", "Action Adventure Sci-Fi", "English"),
    ("Gladiator", "Action Adventure Drama", "English"),
    ("The Godfather", "Crime Drama", "English"),
    ("Pulp Fiction", "Crime Drama", "English"),
    ("The Shawshank Redemption", "Drama", "English"),
    ("Forrest Gump", "Drama Romance", "English"),
    ("Fight Club", "Drama", "English"),
    ("The Lord of the Rings: The Fellowship of the Ring", "Action Adventure Drama", "English"),
    ("The Lord of the Rings: The Two Towers", "Action Adventure Drama", "English"),
    ("The Lord of the Rings: The Return of the King", "Action Adventure Drama", "English"),
    ("Star Wars: Episode IV - A New Hope", "Action Adventure Sci-Fi", "English"),
    ("Star Wars: Episode V - The Empire Strikes Back", "Action Adventure Sci-Fi", "English"),
    ("Spider-Man: No Way Home", "Action Adventure Fantasy", "English"),
    ("Spider-Man: Into the Spider-Verse", "Animation Action Adventure", "English"),
    ("Spider-Man: Across the Spider-Verse", "Animation Action Adventure", "English"),
    ("Dune", "Action Adventure Drama", "English"),
    ("Dune: Part Two", "Action Adventure Drama", "English"),
    ("Oppenheimer", "Biography Drama History", "English"),
    ("Barbie", "Adventure Comedy Fantasy", "English"),
    ("John Wick", "Action Crime Thriller", "English"),
    ("John Wick: Chapter 4", "Action Crime Thriller", "English"),
    ("Top Gun: Maverick", "Action Drama", "English"),
    ("Mad Max: Fury Road", "Action Adventure Sci-Fi", "English"),
    ("Jurassic Park", "Action Adventure Sci-Fi", "English"),
    ("Titanic", "Drama Romance", "English"),
    ("The Terminator", "Action Sci-Fi", "English"),
    ("Terminator 2: Judgment Day", "Action Sci-Fi", "English"),
    ("Alien", "Horror Sci-Fi", "English"),
    ("Aliens", "Action Adventure Sci-Fi", "English"),
    ("The Lion King", "Animation Adventure Drama", "English"),
    ("Toy Story", "Animation Adventure Comedy", "English"),
    ("Up", "Animation Adventure Comedy", "English"),
    ("WALL·E", "Animation Adventure Family", "English"),
    ("Inside Out", "Animation Adventure Comedy", "English"),
    ("Coco", "Animation Adventure Family", "English"),
    ("Everything Everywhere All at Once", "Action Adventure Comedy", "English"),
    ("Knives Out", "Comedy Crime Drama", "English"),
    ("Get Out", "Horror Mystery Thriller", "English"),
    ("A Quiet Place", "Horror Sci-Fi", "English"),
    ("It", "Horror", "English"),
    ("The Conjuring", "Horror Mystery Thriller", "English"),
    ("Joker", "Crime Drama Thriller", "English"),
    ("The Batman", "Action Crime Drama", "English"),
    ("Deadpool", "Action Comedy", "English")
]

print("Generating clean movies database...")
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

for title, genre, language in movies:
    cursor.execute("INSERT INTO movies VALUES (?, ?, ?)", (title, genre, language))

conn.commit()
conn.close()
print(f"SUCCESS! Added {len(movies)} top-tier curated movies to the database.")
