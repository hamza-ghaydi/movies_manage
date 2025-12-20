import { useState, useEffect } from 'react';
import MovieForm from './components/MovieForm';
import ImdbImport from './components/ImdbImport';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import WatchedPage from './components/WatchedPage';
import ToWatchPage from './components/ToWatchPage';
import { fetchMovies, createMovie, updateMovie, deleteMovie } from './utils/api';
import { Loader2 } from 'lucide-react';

function App() {
  const [movies, setMovies] = useState([]);
  const [activeView, setActiveView] = useState('home');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImdbImportOpen, setIsImdbImportOpen] = useState(false);
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

  const handleImdbImportSuccess = async (importedMovie) => {
    // Refresh the movie list to include the newly imported movie
    await loadMovies();
  };

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomePage
            movies={movies}
            onToggleWatched={handleToggleWatched}
            onUpdateReview={handleUpdateReview}
            onDelete={handleDelete}
            onAddMovieClick={() => setIsFormOpen(true)}
            onImportClick={() => setIsImdbImportOpen(true)}
          />
        );
      case 'watched':
        return (
          <WatchedPage
            movies={movies}
            onToggleWatched={handleToggleWatched}
            onUpdateReview={handleUpdateReview}
            onDelete={handleDelete}
          />
        );
      case 'toWatch':
        return (
          <ToWatchPage
            movies={movies}
            onToggleWatched={handleToggleWatched}
            onUpdateReview={handleUpdateReview}
            onDelete={handleDelete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-black to-gray-900 flex">
      <div className="absolute bg-gradient-to-b from-black to-gray-900 backdrop-blur-2xl inset-0"></div>
      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 ml-64 z-10">
        <div className="container mx-auto px-8 py-8 ">
          {error && (
            <div className="glass-card border-red-500/30 text-white px-4 py-3 rounded-xl mb-6">
              <p className="font-semibold">Error: {error}</p>
              <button
                onClick={loadMovies}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={48} className="text-blue-500 animate-spin" />
              <span className="ml-3 text-slate-400">Loading movies...</span>
            </div>
          ) : (
            <>
              <MovieForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onAddMovie={handleAddMovie}
              />

              <ImdbImport
                isOpen={isImdbImportOpen}
                onClose={() => setIsImdbImportOpen(false)}
                onImportSuccess={handleImdbImportSuccess}
              />

              {renderView()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;