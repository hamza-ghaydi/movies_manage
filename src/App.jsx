import { useState, useEffect } from 'react';
import MovieForm from './components/MovieForm';
import MovieList from './components/MovieList';
import { fetchMovies, createMovie, updateMovie, deleteMovie } from './utils/api';
import { Plus, Loader2 } from 'lucide-react';

function App() {
  const [movies, setMovies] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies on component mount
  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMovies();
      setMovies(data);
    } catch (err) {
      setError(err.message || 'Failed to load movies');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = async (movieData) => {
    // Optimistically add movie
    const tempMovie = {
      ...movieData,
      id: Date.now(), // Temporary ID
      watched: false
    };
    setMovies(prev => [tempMovie, ...prev]);

    try {
      // Create movie via API
      const newMovie = await createMovie({
        title: movieData.title,
        type: movieData.type,
        genre: movieData.genre,
        priority: movieData.priority,
        rating: movieData.rating || null,
        review: movieData.review || ''
      });

      // Replace temporary movie with real one from API
      setMovies(prev => prev.map(m => m.id === tempMovie.id ? newMovie : m));
    } catch (err) {
      // Revert optimistic update on error
      setMovies(prev => prev.filter(m => m.id !== tempMovie.id));
      alert(`Failed to add movie: ${err.message}`);
      console.error('Error adding movie:', err);
    }
  };

  const handleToggleWatched = async (id) => {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    // Optimistic update
    const newWatchedStatus = !movie.watched;
    setMovies(prev =>
      prev.map(m =>
        m.id === id ? { ...m, watched: newWatchedStatus } : m
      )
    );

    try {
      // Update via API
      await updateMovie(id, { watched: newWatchedStatus });
    } catch (err) {
      // Revert on error
      setMovies(prev =>
        prev.map(m =>
          m.id === id ? { ...m, watched: movie.watched } : m
        )
      );
      alert(`Failed to update movie: ${err.message}`);
      console.error('Error updating movie:', err);
    }
  };

  const handleUpdateReview = async (id, newReview) => {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    // Optimistic update
    setMovies(prev =>
      prev.map(m =>
        m.id === id ? { ...m, review: newReview } : m
      )
    );

    try {
      // Update via API
      await updateMovie(id, { review: newReview });
    } catch (err) {
      // Revert on error
      setMovies(prev =>
        prev.map(m =>
          m.id === id ? { ...m, review: movie.review } : m
        )
      );
      alert(`Failed to update review: ${err.message}`);
      console.error('Error updating review:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    const movieToDelete = movies.find(m => m.id === id);
    
    // Optimistic delete
    setMovies(prev => prev.filter(movie => movie.id !== id));

    try {
      // Delete via API
      await deleteMovie(id);
    } catch (err) {
      // Revert on error
      if (movieToDelete) {
        setMovies(prev => [...prev, movieToDelete].sort((a, b) => 
          new Date(b.created_at || 0) - new Date(a.created_at || 0)
        ));
      }
      alert(`Failed to delete movie: ${err.message}`);
      console.error('Error deleting movie:', err);
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-semibold">Error: {error}</p>
            <button
              onClick={loadMovies}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={48} className="text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Loading movies...</span>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default App;