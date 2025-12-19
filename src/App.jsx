import { useState, useEffect } from 'react';
import MovieForm from './components/MovieForm';
import MovieList from './components/MovieList';
import { initialMoviesData } from './data/moviesData';
import { Plus } from 'lucide-react';

const STORAGE_KEY = 'moviesCollection';

function App() {
  const [movies, setMovies] = useState(() => {
    const savedMovies = localStorage.getItem(STORAGE_KEY);
    return savedMovies ? JSON.parse(savedMovies) : initialMoviesData;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  }, [movies]);

  const handleAddMovie = (newMovie) => {
    setMovies(prev => [newMovie, ...prev]);
  };

  const handleToggleWatched = (id) => {
    setMovies(prev =>
      prev.map(movie =>
        movie.id === id ? { ...movie, watched: !movie.watched } : movie
      )
    );
  };

  const handleUpdateReview = (id, newReview) => {
    setMovies(prev =>
      prev.map(movie =>
        movie.id === id ? { ...movie, review: newReview } : movie
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMovies(prev => prev.filter(movie => movie.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            My Movie & Series Collection
          </h1>
          <p className="text-gray-600 mb-6">Track what you've watched and discover what's next</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
          >
            <Plus size={20} />
            Add New Movie
          </button>
        </header>

        <MovieForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onAddMovie={handleAddMovie}
        />

        <MovieList
          movies={movies}
          onToggleWatched={handleToggleWatched}
          onUpdateReview={handleUpdateReview}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;