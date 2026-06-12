import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

df = pd.read_csv("movies.csv")

vectorizer = TfidfVectorizer()
feature_vectors = vectorizer.fit_transform(df["genre"])

similarity = cosine_similarity(feature_vectors)

print("=== Movie Recommendation System ===")

movie_name = input("Enter Movie Name: ")

movie_list = df["title"].str.lower().tolist()

if movie_name.lower() in movie_list:

    index = movie_list.index(movie_name.lower())

    similarity_scores = list(enumerate(similarity[index]))

    sorted_movies = sorted(
        similarity_scores,
        key=lambda x: x[1],
        reverse=True
    )

    print("\nRecommended Movies:\n")

    count = 0

    for movie in sorted_movies[1:]:

        movie_index = movie[0]

        print(df.iloc[movie_index]["title"])

        count += 1

        if count == 5:
            break

else:
    print("Movie not found in dataset.")