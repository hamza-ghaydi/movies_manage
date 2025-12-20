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
      <div className="bg-[#831010] bg-opacity-30 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-6 border border-[#831010] border-opacity-50">
        <div className="flex items-center gap-2 mb-6">
          <Film size={24} className="text-[#db0000]" />
          <h2 className="text-2xl font-bold text-white">My Collection</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-[#831010] bg-opacity-40 backdrop-blur-sm rounded-xl p-4 text-center border border-[#db0000] border-opacity-30 hover:bg-opacity-50 transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-[#564d4d] mt-1">Total</div>
          </div>
          <div className="bg-[#831010] bg-opacity-40 backdrop-blur-sm rounded-xl p-4 text-center border border-[#db0000] border-opacity-30 hover:bg-opacity-50 transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-white">{stats.watched}</div>
            <div className="text-sm text-[#564d4d] mt-1">Watched</div>
          </div>
          <div className="bg-[#831010] bg-opacity-40 backdrop-blur-sm rounded-xl p-4 text-center border border-[#db0000] border-opacity-30 hover:bg-opacity-50 transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-white">{stats.unwatched}</div>
            <div className="text-sm text-[#564d4d] mt-1">To Watch</div>
          </div>
          <div className="bg-[#831010] bg-opacity-40 backdrop-blur-sm rounded-xl p-4 text-center border border-[#db0000] border-opacity-30 hover:bg-opacity-50 transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-white">{stats.movies}</div>
            <div className="text-sm text-[#564d4d] mt-1">Movies</div>
          </div>
          <div className="bg-[#831010] bg-opacity-40 backdrop-blur-sm rounded-xl p-4 text-center border border-[#db0000] border-opacity-30 hover:bg-opacity-50 transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-white">{stats.series}</div>
            <div className="text-sm text-[#564d4d] mt-1">Series</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div>
            <label className="text-sm text-[#564d4d] mr-2">Filter by status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-[#831010] bg-opacity-40 border border-[#db0000] border-opacity-30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#db0000] backdrop-blur-sm"
            >
              <option value="all" className="bg-black">All</option>
              <option value="watched" className="bg-black">Watched</option>
              <option value="unwatched" className="bg-black">To Watch</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[#564d4d] mr-2">Filter by type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-[#831010] bg-opacity-40 border border-[#db0000] border-opacity-30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#db0000] backdrop-blur-sm"
            >
              <option value="all" className="bg-black">All</option>
              <option value="movie" className="bg-black">Movies</option>
              <option value="series" className="bg-black">Series</option>
            </select>
          </div>
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="bg-[#831010] bg-opacity-30 backdrop-blur-md rounded-2xl shadow-2xl p-12 text-center border border-[#831010] border-opacity-50">
          <Film size={48} className="mx-auto text-[#564d4d] mb-4" />
          <p className="text-white text-lg">No items found</p>
          <p className="text-[#564d4d] text-sm mt-2">Try adjusting your filters or add a new movie/series</p>
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
