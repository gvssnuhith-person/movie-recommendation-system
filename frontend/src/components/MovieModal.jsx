import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Info, Tv, Award } from 'lucide-react';
import axios from 'axios';

// We are now using OMDB (IMDB data) because TMDB is blocked by the ISP
// We use a public test key for OMDB which works reliably
const OMDB_API_KEY = "thewdb";

export default function MovieModal({ movieTitle, onClose }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        // Fetch from OMDB API
        const res = await axios.get(`http://www.omdbapi.com/`, {
          params: {
            apikey: OMDB_API_KEY,
            t: movieTitle,
            plot: 'full'
          }
        });

        if (res.data.Response === "True") {
          setMovieDetails(res.data);
        } else {
          setError(res.data.Error || 'Details not found for this movie on IMDB.');
        }
      } catch (err) {
        console.error("Error fetching OMDB data:", err);
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
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
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
            <p className="text-gray-400">Loading details from IMDB for {movieTitle}...</p>
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
                  className="w-full h-full object-cover opacity-90"
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

              {/* Mobile Poster (if desktop poster is hidden) */}
              <div className="md:hidden h-64 relative bg-black">
                 {movieDetails.Poster && movieDetails.Poster !== "N/A" ? (
                  <img
                    src={movieDetails.Poster}
                    alt={movieDetails.Title}
                    className="w-full h-full object-cover opacity-80"
                  />
                 ) : null}
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-gray to-transparent"></div>
              </div>

              <div className="p-6 md:p-8 flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="px-3 py-1 bg-brand-red text-white text-xs font-bold rounded-full">
                    {movieDetails.Year}
                  </span>
                  <span className="text-yellow-500 flex items-center gap-1 text-sm font-bold">
                    ★ {movieDetails.imdbRating} / 10
                  </span>
                  <span className="text-gray-400 text-sm border border-gray-600 px-2 py-0.5 rounded">
                    {movieDetails.Runtime}
                  </span>
                  <span className="text-gray-400 text-sm border border-gray-600 px-2 py-0.5 rounded">
                    {movieDetails.Rated}
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-black mb-4">
                  {movieDetails.Title}
                </h2>

                <p className="text-gray-400 italic mb-6">
                  Directed by: {movieDetails.Director}
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {movieDetails.Genre?.split(', ').map(g => (
                    <span key={g} className="text-xs text-gray-300 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                      {g}
                    </span>
                  ))}
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-white">
                    <Info className="w-5 h-5 text-brand-red" /> Plot
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {movieDetails.Plot}
                  </p>
                </div>

                <div className="mb-8 bg-black/40 p-4 rounded-xl border border-gray-800">
                   <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Cast</h3>
                   <p className="text-gray-200">{movieDetails.Actors}</p>
                </div>

                {movieDetails.Awards && movieDetails.Awards !== "N/A" && (
                  <div className="mt-auto">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-white">
                      <Award className="w-5 h-5 text-brand-red" /> Awards
                    </h3>
                    <p className="text-yellow-500/90 italic">
                      {movieDetails.Awards}
                    </p>
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