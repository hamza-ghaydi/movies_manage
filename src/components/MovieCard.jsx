import { useState } from 'react';
import { Star, Film, Tv, Edit2, Save, X, CheckCircle } from 'lucide-react';

function MovieCard({ movie, onToggleWatched, onUpdateReview, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState(movie.review);

  const handleSaveReview = () => {
    onUpdateReview(movie.id, editedReview);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedReview(movie.review);
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    if (priority >= 4) return 'text-[#db0000]';
    if (priority === 3) return 'text-[#ffaa00]';
    return 'text-[#00aa00]';
  };

  const getPriorityLabel = (priority) => {
    if (priority >= 4) return 'High';
    if (priority === 3) return 'Medium';
    return 'Low';
  };

  return (
    <div className={`glass-card rounded-2xl p-6 transition-all duration-300 hover:glass-strong hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(219,0,0,0.4)] ${
      movie.watched ? 'border-l-4 border-l-[#00aa00]' : 'border-l-4 border-l-[#564d4d]'
    }`}>
      <div className="flex flex-col mb-4">
        {/* Poster Image - Larger and more prominent */}
        {movie.poster && (
          <div className="w-full mb-4 group/poster relative overflow-hidden rounded-xl">
            <img 
              src={movie.poster} 
              alt={`${movie.title} poster`}
              className="w-full h-72 object-cover rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover/poster:scale-105"
              onError={(e) => {
                // Hide image if it fails to load
                e.target.style.display = 'none';
              }}
            />
            {movie.watched && (
              <div className="absolute top-2 right-2 bg-[#00aa00] rounded-full p-1.5">
                <CheckCircle size={16} className="text-white" />
              </div>
            )}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {movie.type === 'movie' ? (
                  <Film size={20} className="text-[#db0000]" />
                ) : (
                  <Tv size={20} className="text-[#db0000]" />
                )}
                <h3 className="text-xl font-bold text-white">{movie.title}</h3>
              </div>
            </div>

            <button
              onClick={() => onDelete(movie.id)}
              className="text-[#564d4d] hover:text-[#db0000] transition-colors flex-shrink-0"
              title="Delete"
            >
              <X size={20} />
            </button>
          </div>

          {movie.genre.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genre.map((g, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#831010] bg-opacity-50 text-white text-xs rounded-full border border-[#db0000] border-opacity-30"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <span className="text-sm text-[#564d4d]">Priority:</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                size={16}
                className={idx < movie.priority ? getPriorityColor(movie.priority) : 'text-[#564d4d]'}
                fill={idx < movie.priority ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className={`text-sm font-semibold ${getPriorityColor(movie.priority)}`}>
            ({getPriorityLabel(movie.priority)})
          </span>
        </div>

        {movie.rating && (
          <div className="flex items-center gap-1">
            <span className="text-sm text-[#564d4d]">Rating:</span>
            <span className="text-sm font-bold text-[#db0000]">{movie.rating}/10</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        {isEditing ? (
          <div>
            <textarea
              value={editedReview}
              onChange={(e) => setEditedReview(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 bg-[#831010] bg-opacity-40 border border-[#db0000] border-opacity-30 rounded-xl text-white placeholder-[#564d4d] focus:outline-none focus:ring-2 focus:ring-[#db0000] mb-2 backdrop-blur-sm"
              placeholder="Write your review..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveReview}
                className="flex items-center gap-1 px-3 py-1 bg-[#db0000] hover:bg-[#b80000] text-white text-sm rounded-xl transition-all duration-300"
              >
                <Save size={14} />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 px-3 py-1 bg-[#564d4d] hover:bg-[#6b5f5f] text-white text-sm rounded-xl transition-all duration-300"
              >
                <X size={14} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-[#564d4d]">Review:</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-[#db0000] hover:text-[#ff1a1a] transition-colors"
                title="Edit review"
              >
                <Edit2 size={16} />
              </button>
            </div>
            <p className="text-white text-sm">
              {movie.review || 'No review yet...'}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => onToggleWatched(movie.id)}
        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
          movie.watched
            ? 'bg-[#564d4d] hover:bg-[#6b5f5f] text-white'
            : 'bg-[#db0000] hover:bg-[#b80000] text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {movie.watched ? 'Mark as Unwatched' : 'Mark as Watched'}
      </button>
    </div>
  );
}

export default MovieCard;
