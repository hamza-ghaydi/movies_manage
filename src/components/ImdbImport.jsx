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
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-strong rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="flex items-center rounded-t-2xl justify-between sticky top-0 glass p-6">
          <div className="flex items-center gap-3">
            <Film size={24} className="text-blue-700" />
            <h2 className="text-2xl font-bold text-white">Import from IMDb</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">
              IMDb Link or ID
            </label>
            <input
              type="text"
              value={imdbLink}
              onChange={(e) => setImdbLink(e.target.value)}
              placeholder="https://www.imdb.com/title/tt3896198/ or tt3896198"
              className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#db0000] focus:border-[#db0000] focus:border-opacity-40"
              disabled={loading}
            />
            <p className="mt-2 text-sm text-white/70">
              Enter an IMDb URL or just the ID (e.g., tt3896198)
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-[#831010] bg-opacity-50 border border-[#db0000] text-white px-4 py-3 rounded-xl">
              <p className="font-semibold">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !imdbLink.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-700/90 hover:bg-blue-700/90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
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
              className="flex-1 bg-gray-700/50 hover:bg-[#6b5f5f] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50"
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


