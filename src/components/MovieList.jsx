import { useState } from 'react';
import MovieCard from './MovieCard';
import { Film } from 'lucide-react';

function MovieList({ movies, onToggleWatched, onUpdateReview, onDelete }) {
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredMovies = movies.filter(movie => {
    const watchedFilter = filter === 'all' ||
                         (filter === 'watched' && movie.watched) ||
                         (filter === 'unwatched' && !movie.watched);

    const typeMatch = typeFilter === 'all' || movie.type === typeFilter;

    return watchedFilter && typeMatch;
  });

  const stats = {
    total: movies.length,
    watched: movies.filter(m => m.watched).length,
    unwatched: movies.filter(m => !m.watched).length,
    movies: movies.filter(m => m.type === 'movie').length,
    series: movies.filter(m => m.type === 'series').length
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Film size={24} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">My Collection</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.watched}</div>
            <div className="text-sm text-gray-600">Watched</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.unwatched}</div>
            <div className="text-sm text-gray-600">To Watch</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.movies}</div>
            <div className="text-sm text-gray-600">Movies</div>
          </div>
          <div className="bg-pink-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-pink-600">{stats.series}</div>
            <div className="text-sm text-gray-600">Series</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div>
            <label className="text-sm text-gray-600 mr-2">Filter by status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="watched">Watched</option>
              <option value="unwatched">To Watch</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 mr-2">Filter by type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="movie">Movies</option>
              <option value="series">Series</option>
            </select>
          </div>
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Film size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No items found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or add a new movie/series</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default MovieList;
