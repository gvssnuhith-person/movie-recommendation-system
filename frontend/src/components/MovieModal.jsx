import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Info, Tv, Award, Globe } from 'lucide-react';
import axios from 'axios';

const OMDB_API_KEY = "thewdb";

export default function MovieModal({ movieTitle, onClose }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch Wikipedia summary as a fallback
  const fetchWikiFallback = async (title) => {
    try {
      // Use Wikipedia's REST API for a clean text summary
      const cleanTitle = title.split(':')[0].split('-')[0].trim();
      const wikiRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTitle + ' (film)')}`);

      // Also try fetching the main image if available
      let imageUrl = null;
      if (wikiRes.data.thumbnail && wikiRes.data.thumbnail.source) {
          imageUrl = wikiRes.data.thumbnail.source;
      }

      setMovieDetails({
        isWikiFallback: true,
        Title: title,
        Year: "Unknown",
        Plot: wikiRes.data.extract || "No plot summary available on Wikipedia.",
        Poster: imageUrl || "N/A",
        Genre: "Regional / Telugu",
        Director: "Various",
        Actors: "Various",
        imdbRating: "N/A",
        Runtime: "N/A"
      });
      return true;
    } catch (wikiErr) {
      // If "(film)" suffix failed, try just the title
      try {
        const cleanTitle = title.split(':')[0].split('-')[0].trim();
        const wikiRes2 = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTitle)}`);

        let imageUrl = null;
        if (wikiRes2.data.thumbnail && wikiRes2.data.thumbnail.source) {
            imageUrl = wikiRes2.data.thumbnail.source;
        }

        setMovieDetails({
          isWikiFallback: true,
          Title: title,
          Year: "Unknown",
          Plot: wikiRes2.data.extract || "No plot summary available on Wikipedia.",
          Poster: imageUrl || "N/A",
          Genre: "Regional / Telugu",
          Director: "Various",
          Actors: "Various",
          imdbRating: "N/A",
          Runtime: "N/A"
        });
        return true;
      } catch (e2) {
        return false;
      }
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError('');

        // 1. Try OMDB (IMDB) First
        const res = await axios.get(`https://www.omdbapi.com/`, {
          params: {
            apikey: OMDB_API_KEY,
            t: movieTitle,
            plot: 'full'
          }
        });

        if (res.data.Response === "True") {
          setMovieDetails(res.data);
          setLoading(false);
          return;
        }

        // 2. If OMDB fails, try stripping colons/subtitles
        const cleanTitle = movieTitle.split(':')[0].split('-')[0].trim();
        if (cleanTitle !== movieTitle) {
            const retryRes = await axios.get(`https://www.omdbapi.com/`, {
              params: {
                apikey: OMDB_API_KEY,
                t: cleanTitle,
                plot: 'full'
              }
            });
            if (retryRes.data.Response === "True") {
                setMovieDetails(retryRes.data);
                setLoading(false);
                return;
            }
        }

        // 3. WIKIPEDIA FALLBACK
        const wikiSuccess = await fetchWikiFallback(movieTitle);
        if (!wikiSuccess) {
            setError(`Details not found for "${movieTitle}" on IMDB or Wikipedia.`);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load movie details. Check network connection.');
      } finally {
        setLoading(false);
      }
    };

    if (movieTitle) {
      fetchMovieDetails();
    }
  }, [movieTitle]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-brand-gray border border-gray-800 rounded-2xl overflow-hidden shadow-2xl overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-brand-red rounded-full text-white transition-colors backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Searching IMDB and Wikipedia for {movieTitle}...</p>
          </div>
        ) : error ? (
          <div className="h-96 flex items-center justify-center p-8 text-center">
            <div className="bg-red-900/30 border border-red-500 rounded-xl p-6">
              <p className="text-red-400 text-lg mb-2">{error}</p>
              <p className="text-gray-400">Title searched: {movieTitle}</p>
            </div>
          </div>
        ) : movieDetails && (
          <div className="flex flex-col md:flex-row">

            {/* Left Column: Poster */}
            <div className="md:w-1/3 relative bg-black hidden md:block">
              {movieDetails.Poster && movieDetails.Poster !== "N/A" ? (
                <img
                  src={movieDetails.Poster}
                  alt={movieDetails.Title}
                  className={`w-full h-full object-cover opacity-90 ${movieDetails.isWikiFallback ? 'object-contain bg-white p-4' : ''}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>

            {/* Right Column: Info */}
            <div className="md:w-2/3 flex flex-col relative">

              <div className="p-6 md:p-8 flex-1">

                {movieDetails.isWikiFallback && (
                    <div className="mb-4 inline-flex items-center gap-2 bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-800">
                        <Globe className="w-4 h-4" />
                        Sourced from Wikipedia
                    </div>
                )}

                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="px-3 py-1 bg-brand-red text-white text-xs font-bold rounded-full">
                    {movieDetails.Year}
                  </span>
                  {!movieDetails.isWikiFallback && (
                      <>
                        <span className="text-yellow-500 flex items-center gap-1 text-sm font-bold">
                            ★ {movieDetails.imdbRating} / 10
                        </span>
                        <span className="text-gray-400 text-sm border border-gray-600 px-2 py-0.5 rounded">
                            {movieDetails.Runtime}
                        </span>
                      </>
                  )}
                </div>

                <h2 className="text-3xl md:text-5xl font-black mb-4">
                  {movieDetails.Title}
                </h2>

                <p className="text-gray-400 italic mb-6">
                  Directed by: {movieDetails.Director}
                </p>

                <div className="mb-8">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-white">
                    <Info className="w-5 h-5 text-brand-red" /> Plot Summary
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {movieDetails.Plot}
                  </p>
                </div>

                {!movieDetails.isWikiFallback && (
                    <div className="mb-8 bg-black/40 p-4 rounded-xl border border-gray-800">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Cast</h3>
                        <p className="text-gray-200">{movieDetails.Actors}</p>
                    </div>
                )}

              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}