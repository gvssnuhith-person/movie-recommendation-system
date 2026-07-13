import urllib.request
import zipfile
import pandas as pd
url = "https://files.grouplens.org/datasets/movielens/ml-latest-small.zip"
urllib.request.urlretrieve(url, "ml.zip")
with zipfile.ZipFile("ml.zip", "r") as z: z.extractall(".")
df = pd.read_csv("ml-latest-small/movies.csv")
df = df.rename(columns={"genres": "genre"})
df["genre"] = df["genre"].str.replace("|", " ", regex=False)
df["title"] = df["title"].str.replace(r"\s*\(\d{4}\)\s*$", "", regex=True)
df = df.drop_duplicates(subset=["title"])
df[["title", "genre"]].to_csv("movies.csv", index=False)
print("Done!")
