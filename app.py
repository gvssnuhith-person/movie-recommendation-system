import streamlit as st
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

st.title("🎬 Movie Recommendation System")

df = pd.read_csv("movies.csv")

vectorizer = TfidfVectorizer()
feature_vectors = vectorizer.fit_transform(df["genre"])

similarity = cosine_similarity(feature_vectors)

movie_name = st.selectbox(
    "Select a Movie",
    df["title"].tolist()
)

if st.button("Recommend"):

    movie_list = df["title"].str.lower().tolist()

    index = movie_list.index(movie_name.lower())

    similarity_scores = list(enumerate(similarity[index]))

    sorted_movies = sorted(
        similarity_scores,
        key=lambda x: x[1],
        reverse=True
    )

    st.subheader("Recommended Movies")

    count = 0

    for movie in sorted_movies[1:]:

        movie_index = movie[0]

        st.write(df.iloc[movie_index]["title"])

        count += 1

        if count == 5:
            break