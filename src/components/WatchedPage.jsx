import { useState, useMemo } from 'react';
import { Film, Star } from 'lucide-react';
import MovieCard from './MovieCard';

function WatchedPage({ movies, onToggleWatched, onUpdateReview, onDelete }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Get all unique genres from watched movies
  const allGenres = useMemo(() => {
    const genres = new Set();
    movies.filter(m => m.watched).forEach(movie => {
      if (Array.isArray(movie.genre)) {
        movie.genre.forEach(g => genres.add(g));
      }
    });
    return Array.from(genres).sort();
  }, [movies]);

  // Filter watched movies
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      if (!movie.watched) return false;

      // Type filter
      const matchesType = typeFilter === 'all' || movie.type === typeFilter;

      // Genre filter
      const matchesGenre = genreFilter === 'all' || 
        (Array.isArray(movie.genre) && movie.genre.includes(genreFilter));

      // Rating filter
      const matchesRating = ratingFilter === 'all' || 
        (ratingFilter === 'rated' && movie.rating) ||
        (ratingFilter === 'unrated' && !movie.rating) ||
        (ratingFilter !== 'all' && ratingFilter !== 'rated' && ratingFilter !== 'unrated' && 
         movie.rating && movie.rating >= parseInt(ratingFilter));

      return matchesType && matchesGenre && matchesRating;
    });
  }, [movies, typeFilter, genreFilter, ratingFilter]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Watched</h1>
        <p className="text-sm sm:text-base text-[#564d4d]">Your completed movies and series</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-col sm:flex-row w-full gap-4">
          <div className="w-full sm:w-1/3">
            <label className="block text-sm text-[#564d4d] mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 w-full py-2 glass-light rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#db0000] focus:border-[#db0000] focus:border-opacity-40"
            >
              <option value="all" className="bg-black">All</option>
              <option value="movie" className="bg-black">Movies</option>
              <option value="series" className="bg-black">Series</option>
            </select>
          </div>

          <div className="w-full sm:w-1/3">
            <label className="block text-sm text-[#564d4d] mb-2">Genre</label>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="px-4 w-full py-2 glass-light rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#db0000] focus:border-[#db0000] focus:border-opacity-40"
            >
              <option value="all" className="bg-black">All Genres</option>
              {allGenres.map(genre => (
                <option key={genre} value={genre} className="bg-black">{genre}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-1/3">
            <label className="block text-sm text-[#564d4d] mb-2">Rating</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 w-full py-2 glass-light rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#db0000] focus:border-[#db0000] focus:border-opacity-40"
            >
              <option value="all" className="bg-black">All Ratings</option>
              <option value="rated" className="bg-black">Rated</option>
              <option value="unrated" className="bg-black">Unrated</option>
              <option value="8" className="bg-black">8+ Stars</option>
              <option value="7" className="bg-black">7+ Stars</option>
              <option value="6" className="bg-black">6+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredMovies.length === 0 ? (
        <div className="glass-strong rounded-2xl p-12 text-center">
          <Film size={48} className="mx-auto text-[#564d4d] mb-4" />
          <p className="text-white text-lg">No watched items found</p>
          <p className="text-[#564d4d] text-sm mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleWatched={onToggleWatched}
              onUpdateReview={onUpdateReview}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchedPage;

