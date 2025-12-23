import { useState } from 'react';
import { Star, Film, Tv, Edit2, Save, X } from 'lucide-react';

function MovieCard({ movie, onToggleWatched, onUpdateReview, onDelete, viewMode = 'grid' }) {
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
    if (priority >= 4) return 'text-blue-400';
    if (priority === 3) return 'text-blue-300';
    return 'text-blue-200';
  };

  const getPriorityLabel = (priority) => {
    if (priority >= 4) return 'High';
    if (priority === 3) return 'Medium';
    return 'Low';
  };

  if (viewMode === 'list') {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_8px_32px_rgba(59,130,246,0.3)] hover:scale-[1.01]">
        <div className="flex gap-4">
          {/* Poster - Smaller in list view */}
          {movie.poster && (
            <div className="w-24 h-36 flex-shrink-0 overflow-hidden rounded-lg relative group">
              <img 
                src={movie.poster} 
                alt={`${movie.title} poster`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {movie.type === 'movie' ? (
                  <Film size={18} className="text-blue-400" />
                ) : (
                  <Tv size={18} className="text-blue-400" />
                )}
                <h3 className="text-lg font-bold text-white">{movie.title}</h3>
              </div>
              <button
                onClick={() => onDelete(movie.id)}
                className="text-slate-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 items-center mb-2">
              {/* Priority */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">Priority:</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      className={idx < movie.priority ? getPriorityColor(movie.priority) : 'text-slate-600'}
                      fill={idx < movie.priority ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>

              {/* Rating */}
              {movie.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">Rating:</span>
                  <span className="text-sm font-bold text-blue-400">{movie.rating}/10</span>
                </div>
              )}

              {/* Genres */}
              {movie.genre && movie.genre.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {movie.genre.map((g, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 backdrop-blur-md bg-blue-500/20 text-blue-200 text-xs rounded-full border border-blue-400/30"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Review */}
            <div className="mb-3 flex-1">
              {isEditing ? (
                <div>
                  <textarea
                    value={editedReview}
                    onChange={(e) => setEditedReview(e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Write your review..."
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSaveReview}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-all duration-300"
                    >
                      <Save size={12} />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 px-3 py-1 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-all duration-300"
                    >
                      <X size={12} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-400">Review:</span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      title="Edit review"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                  <p className="text-white text-sm line-clamp-2">
                    {movie.review || 'No review yet...'}
                  </p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={() => onToggleWatched(movie.id)}
              className="self-start px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/50"
            >
              Mark as Watched
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_8px_32px_rgba(59,130,246,0.4)] hover:scale-[1.02] group">
      {/* Poster Image */}
      {movie.poster && (
        <div className="w-full mb-4 relative overflow-hidden rounded-xl">
          <img 
            src={movie.poster} 
            alt={`${movie.title} poster`}
            className="w-full h-64 object-cover rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105"
            onError={(e) => e.target.style.display = 'none'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          {movie.type === 'movie' ? (
            <Film size={20} className="text-blue-400 flex-shrink-0" />
          ) : (
            <Tv size={20} className="text-blue-400 flex-shrink-0" />
          )}
          <h3 className="text-lg font-bold text-white line-clamp-1">{movie.title}</h3>
        </div>
        <button
          onClick={() => onDelete(movie.id)}
          className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0 ml-2"
          title="Delete"
        >
          <X size={20} />
        </button>
      </div>

      {/* Genres */}
      {movie.genre && movie.genre.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {movie.genre.map((g, idx) => (
            <span
              key={idx}
              className="px-3 py-1 backdrop-blur-md bg-blue-500/20 text-blue-200 text-xs rounded-full border border-blue-400/30"
            >
              {g}
            </span>
          ))}
        </div>
      )}

      {/* Priority & Rating */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Priority:</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                size={16}
                className={idx < movie.priority ? getPriorityColor(movie.priority) : 'text-slate-600'}
                fill={idx < movie.priority ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className={`text-xs font-semibold ${getPriorityColor(movie.priority)}`}>
            ({getPriorityLabel(movie.priority)})
          </span>
        </div>

        {movie.rating && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Rating:</span>
            <span className="text-sm font-bold text-blue-400">{movie.rating}/10</span>
          </div>
        )}
      </div>

      {/* Review */}
      <div className="mb-4">
        {isEditing ? (
          <div>
            <textarea
              value={editedReview}
              onChange={(e) => setEditedReview(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 backdrop-blur-md bg-white/5 border border-white/20 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent mb-2"
              placeholder="Write your review..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveReview}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-all duration-300"
              >
                <Save size={14} />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 px-3 py-1.5 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-all duration-300"
              >
                <X size={14} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-400">Review:</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
                title="Edit review"
              >
                <Edit2 size={16} />
              </button>
            </div>
            <p className="text-white text-sm line-clamp-3">
              {movie.review || 'No review yet...'}
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => onToggleWatched(movie.id)}
        className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/50"
      >
        Mark as Watched
      </button>
    </div>
  );
}

export default MovieCard;