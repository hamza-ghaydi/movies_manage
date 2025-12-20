import { useState } from 'react';
import { Film, Loader2, X, ExternalLink } from 'lucide-react';
import { importMovieFromImdb } from '../utils/api';

function ImdbImport({ isOpen, onClose, onImportSuccess }) {
  const [imdbLink, setImdbLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imdbLink.trim()) {
      setError('Please enter an IMDb link or ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await importMovieFromImdb(imdbLink.trim());
      
      // Success!
      setImdbLink('');
      if (onImportSuccess) {
        onImportSuccess(result.movie);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to import movie from IMDb');
      console.error('Error importing from IMDb:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setImdbLink('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex items-center justify-between sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Film size={24} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Import from IMDb</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IMDb Link or ID
            </label>
            <input
              type="text"
              value={imdbLink}
              onChange={(e) => setImdbLink(e.target.value)}
              placeholder="https://www.imdb.com/title/tt3896198/ or tt3896198"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter an IMDb URL or just the ID (e.g., tt3896198)
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-semibold">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !imdbLink.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <ExternalLink size={20} />
                  Import Movie/Series
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-md transition duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImdbImport;


