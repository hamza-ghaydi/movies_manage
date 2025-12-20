import { useState, useMemo } from 'react';
import { Search, Plus, Film, Star } from 'lucide-react';
import MovieCard from './MovieCard';
import CompactMovieCard from './CompactMovieCard';

function HomePage({ 
  movies, 
  onToggleWatched, 
  onUpdateReview, 
  onDelete,
  onAddMovieClick,
  onImportClick 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Get all unique genres
  const allGenres = useMemo(() => {
    const genres = new Set();
    movies.forEach(movie => {
      if (Array.isArray(movie.genre)) {
        movie.genre.forEach(g => genres.add(g));
      }
    });
    return Array.from(genres).sort();
  }, [movies]);

  // Filter movies
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      // Search filter
      const matchesSearch = !searchQuery || 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(movie.genre) && movie.genre.some(g => 
          g.toLowerCase().includes(searchQuery.toLowerCase())
        ));

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

      return matchesSearch && matchesType && matchesGenre && matchesRating;
    });
  }, [movies, searchQuery, typeFilter, genreFilter, ratingFilter]);

  // Get recently added (last 10, sorted by created_at)
  const recentMovies = useMemo(() => {
    return [...movies]
      .sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB - dateA;
      })
      .slice(0, 10);
  }, [movies]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: movies.length,
      watched: movies.filter(m => m.watched).length,
      unwatched: movies.filter(m => !m.watched).length,
      movies: movies.filter(m => m.type === 'movie').length,
      series: movies.filter(m => m.type === 'series').length
    };
  }, [movies]);

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30" size={20}  />
            <input
              type="text"
              placeholder="Search movies, series, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-950/90 focus:border-blue-950/90 focus:border-opacity-40"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onAddMovieClick}
            className="inline-flex items-center gap-2 bg-blue-950/90 hover:bg-blue-950/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus size={20} />
            Add Movie / Series
          </button>
          <button
            onClick={onImportClick}
            className="inline-flex items-center gap-2 bg-blue-950/90 hover:bg-blue-950/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Film size={20} />
            Import from IMDb
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card rounded-xl p-4 text-center hover:glass-strong transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-white/70 mt-1">Total</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center hover:glass-strong transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-bold text-white">{stats.watched}</div>
          <div className="text-sm text-white/70 mt-1">Watched</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center hover:glass-strong transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-bold text-white">{stats.unwatched}</div>
          <div className="text-sm text-white/70 mt-1">To Watch</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center hover:glass-strong transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-bold text-white">{stats.movies}</div>
          <div className="text-sm text-white/70 mt-1">Movies</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center hover:glass-strong transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-bold text-white">{stats.series}</div>
          <div className="text-sm text-white/70 mt-1">Series</div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4">
        <div className="flex w-full gap-4">
          <div className="w-1/3">
            <label className="block text-sm text-white/70 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 w-full py-2 glass-light rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-950/90 focus:border-blue-950/90 focus:border-opacity-40"
            >
              <option value="all" className="bg-gray-900/15">All</option>
              <option value="movie" className="bg-gray-900/15">Movies</option>
              <option value="series" className="bg-gray-900/15">Series</option>
            </select>
          </div>

          <div className="w-1/3">
            <label className="block text-sm text-white/70 mb-2">Genre</label>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="px-4 w-full py-2 glass-light rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-950/90 focus:border-blue-950/90 focus:border-opacity-40"
            >
              <option value="all" className="bg-black">All Genres</option>
              {allGenres.map(genre => (
                <option key={genre} value={genre} className="bg-gray-900/15">{genre}</option>
              ))}
            </select>
          </div>

          <div className="w-1/3">
            <label className="block text-sm text-white/70 mb-2">Rating</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2 w-full glass-light rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-950/90 focus:border-blue-950/90 focus:border-opacity-40"
            >
              <option value="all" className="bg-gray-900/15">All Ratings</option>
              <option value="rated" className="bg-gray-900/15">Rated</option>
              <option value="unrated" className="bg-gray-900/15">Unrated</option>
              <option value="8" className="bg-gray-900/15">8+ Stars</option>
              <option value="7" className="bg-gray-900/15">7+ Stars</option>
              <option value="6" className="bg-gray-900/15">6+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recent Added - Horizontal Scroll */}
      {recentMovies.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Recent Added</h2>
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-4" style={{ width: 'max-content' }}>
              {recentMovies.map(movie => (
                <div key={movie.id} className="flex-shrink-0" style={{ width: '200px' }}>
                  <CompactMovieCard
                    movie={movie}
                    onToggleWatched={onToggleWatched}
                    onDelete={onDelete}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* My Collection Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">My Collection</h2>
        {filteredMovies.length === 0 ? (
          <div className="glass-strong rounded-2xl p-12 text-center">
            <Film size={48} className="mx-auto text-white/70 mb-4" />
            <p className="text-white text-lg">No items found</p>
            <p className="text-white/70 text-sm mt-2">Try adjusting your filters or add a new movie/series</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
}

export default HomePage;

