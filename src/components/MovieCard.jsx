import { useState } from 'react';
import { Star, Film, Tv, Edit2, Save, X } from 'lucide-react';

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
    if (priority >= 4) return 'text-red-500';
    if (priority === 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getPriorityLabel = (priority) => {
    if (priority >= 4) return 'High';
    if (priority === 3) return 'Medium';
    return 'Low';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-5 transition-all duration-200 hover:shadow-lg ${
      movie.watched ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300'
    }`}>
      <div className="flex gap-4 mb-3">
        {/* Poster Image */}
        {movie.poster && (
          <div className="flex-shrink-0">
            <img 
              src={movie.poster} 
              alt={`${movie.title} poster`}
              className="w-32 h-48 object-cover rounded-md shadow-sm"
              onError={(e) => {
                // Hide image if it fails to load
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {movie.type === 'movie' ? (
                  <Film size={20} className="text-blue-600" />
                ) : (
                  <Tv size={20} className="text-purple-600" />
                )}
                <h3 className="text-xl font-bold text-gray-800">{movie.title}</h3>
              </div>
            </div>

            <button
              onClick={() => onDelete(movie.id)}
              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              title="Delete"
            >
              <X size={20} />
            </button>
          </div>

          {movie.genre.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {movie.genre.map((g, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">Priority:</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                size={16}
                className={idx < movie.priority ? getPriorityColor(movie.priority) : 'text-gray-300'}
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
            <span className="text-sm text-gray-600">Rating:</span>
            <span className="text-sm font-bold text-yellow-600">{movie.rating}/10</span>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="Write your review..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveReview}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
              >
                <Save size={14} />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
              >
                <X size={14} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Review:</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 transition-colors"
                title="Edit review"
              >
                <Edit2 size={16} />
              </button>
            </div>
            <p className="text-gray-600 text-sm">
              {movie.review || 'No review yet...'}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => onToggleWatched(movie.id)}
        className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
          movie.watched
            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {movie.watched ? 'Mark as Unwatched' : 'Mark as Watched'}
      </button>
    </div>
  );
}

export default MovieCard;
