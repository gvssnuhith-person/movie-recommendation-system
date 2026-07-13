import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Film, Star, ArrowRight, Globe, Linkedin, Share2 } from 'lucide-react';
import Scene from './components/Scene';
import MovieModal from './components/MovieModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Language filter state
  const [language, setLanguage] = useState('All');

  // Modal State
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch movies for autocomplete based on language
  useEffect(() => {
    axios.get(`${API_URL}/movies?language=${language}`)
      .then(res => setMoviesList(res.data.movies))
      .catch(err => console.error("Could not load movie list", err));
  }, [language]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setRecommendations(null);

    try {
      const response = await axios.get(`${API_URL}/recommend?movie=${encodeURIComponent(searchTerm)}`);

      // If a language is selected (not 'All'), filter the recommendations on the frontend
      if (language !== 'All') {
          const filteredRecs = response.data.recommendations.filter(r => r.language === language);

          if (filteredRecs.length === 0) {
              setError(`No ${language} recommendations found for this movie. Try searching without the language filter.`);
              setLoading(false);
              return;
          }

          setRecommendations({
              searched_movie: response.data.searched_movie,
              recommendations: filteredRecs
          });
      } else {
          setRecommendations(response.data);
      }

    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(err.response.data.detail || 'Movie not found in our database. Try another movie.');
      } else if (err.response && err.response.status === 500) {
         setError('Server error: Make sure the Python backend is running successfully.');
      } else {
        setError(`Network error: Cannot connect to ${API_URL}. Is uvicorn running?`);
      }
    } finally {
      setLoading(false);
    }
  };

  const openModal = (movieTitle) => {
    setSelectedMovie(movieTitle);
    setIsModalOpen(true);
  };

  // LinkedIn Share functionality
  const shareToLinkedIn = () => {
    const url = "https://movierecomended.vercel.app";
    const title = "Check out CineMatch, the AI-powered Movie Recommendation System I built!";
    const summary = "I built a full-stack Machine Learning web app using React, FastAPI, and Scikit-learn. It uses TF-IDF and Cosine Similarity to recommend movies based on thematic genres. Try it out!";

    // LinkedIn Share URL format
    const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(title + '\n\n' + summary + '\n\n' + url)}`;
    window.open(linkedinUrl, '_blank');
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-white">
      {/* 3D Background */}
      <Scene />

      {/* Floating LinkedIn Share Button */}
      <motion.button
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={shareToLinkedIn}
        className="fixed bottom-6 right-6 z-40 bg-[#0a66c2] hover:bg-[#004182] text-white p-4 rounded-full shadow-[0_0_20px_rgba(10,102,194,0.5)] transition-all transform hover:scale-110 flex items-center justify-center group"
        title="Share this project on LinkedIn"
      >
        <Share2 className="w-6 h-6 absolute opacity-0 group-hover:opacity-100 transition-opacity" />
        <Linkedin className="w-6 h-6 group-hover:opacity-0 transition-opacity" />

        {/* Tooltip hint */}
        <span className="absolute right-full mr-4 bg-gray-900 text-sm py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700 pointer-events-none">
          Share Project on LinkedIn!
        </span>
      </motion.button>

      <main className="relative z-10 flex flex-col items-center min-h-screen p-6 pt-16">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-12 h-12 text-brand-red" />
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-2xl">
              Cine<span className="text-brand-red">Match</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-300 font-light drop-shadow-md">
            Experience the next dimension of movie recommendations.
          </p>
        </motion.div>

        {/* Search Bar & Filters */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl relative mb-12 flex flex-col items-center gap-4"
        >
          {/* Language Toggle */}
          <div className="flex bg-brand-gray/80 backdrop-blur-md p-1 rounded-full border border-gray-700 shadow-xl mb-2">
            {['All', 'English', 'Telugu'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
                  language === lang
                  ? 'bg-brand-red text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {lang !== 'All' && <Globe className="w-4 h-4" />}
                {lang}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-red to-red-900 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-brand-gray/90 backdrop-blur-xl rounded-full border border-gray-700 p-2 overflow-hidden shadow-2xl">
              <Search className="w-6 h-6 text-gray-400 ml-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${language === 'All' ? '' : language} movies...`}
                className="w-full bg-transparent border-none outline-none px-4 py-3 text-lg text-white placeholder-gray-400"
                list="movies-list"
              />
              <datalist id="movies-list">
                {moviesList.slice(0, 50).map((m, i) => (
                  <option key={i} value={m} />
                ))}
              </datalist>
              <button
                type="submit"
                disabled={loading}
                className="bg-brand-red hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              >
                {loading ? 'Searching...' : 'Explore'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-900/50 border border-brand-red text-white px-6 py-3 rounded-lg mb-8 backdrop-blur-md"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendations Section */}
        <AnimatePresence>
          {recommendations && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-6xl pb-24"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center drop-shadow-md">
                Because you watched <span className="text-brand-red italic">"{recommendations.searched_movie}"</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.recommendations.map((movie, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{
                      scale: 1.03,
                      translateY: -10,
                      boxShadow: "0 25px 30px -5px rgba(229, 9, 20, 0.3)"
                    }}
                    onClick={() => openModal(movie.title)}
                    className="bg-brand-gray/80 backdrop-blur-xl border border-gray-700 rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Glowing corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-brand-red/40 transition-colors duration-500"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="bg-brand-red text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(229,9,20,0.6)]">
                        Match {index + 1}
                      </div>
                      <Star className="text-yellow-500 w-6 h-6 drop-shadow-md group-hover:scale-110 transition-transform" fill="currentColor" />
                    </div>

                    <h3 className="text-3xl font-black mb-3 relative z-10 line-clamp-2 leading-tight">
                      {movie.title}
                    </h3>

                    <span className="inline-block w-fit mb-4 text-xs font-bold border border-gray-600 text-gray-300 px-3 py-1 rounded-full relative z-10">
                        Language: {movie.language}
                    </span>

                    <p className="text-gray-400 font-medium mb-6 relative z-10 flex-grow">
                      {movie.genre}
                    </p>

                    <div className="mt-4 flex justify-end relative z-10">
                      <button className="text-white bg-white/10 hover:bg-brand-red font-bold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300">
                        View Details <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Movie Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedMovie && (
          <MovieModal
            movieTitle={selectedMovie}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}