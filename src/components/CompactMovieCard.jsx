import { Film, Tv, Star, CheckCircle } from 'lucide-react';

function CompactMovieCard({ movie, onToggleWatched, onDelete }) {
  return (
    <div className="group relative glass-card rounded-xl overflow-hidden transition-all duration-300 hover:glass-strong hover:scale-105 hover:shadow-[0_0_30px_rgba(219,0,0,0.4)]">
      {/* Poster */}
      {movie.poster ? (
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {movie.watched && (
            <div className="absolute top-2 right-2 bg-[#00aa00] rounded-full p-1">
              <CheckCircle size={16} className="text-white" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="flex items-center gap-1 mb-1">
                {movie.type === 'movie' ? (
                  <Film size={14} className="text-[#db0000]" />
                ) : (
                  <Tv size={14} className="text-[#db0000]" />
                )}
                <span className="text-white text-sm font-semibold truncate">{movie.title}</span>
              </div>
              {movie.rating && (
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-[#db0000] fill-[#db0000]" />
                  <span className="text-white text-xs">{movie.rating}/10</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-64 bg-[#831010] bg-opacity-50 flex items-center justify-center">
          {movie.type === 'movie' ? (
            <Film size={48} className="text-[#564d4d]" />
          ) : (
            <Tv size={48} className="text-[#564d4d]" />
          )}
        </div>
      )}

      {/* Title and Info - Always visible on hover or if no poster */}
      <div className="p-3">
        <div className="flex items-center gap-1 mb-1">
          {movie.type === 'movie' ? (
            <Film size={14} className="text-[#db0000]" />
          ) : (
            <Tv size={14} className="text-[#db0000]" />
          )}
          <h3 className="text-white text-sm font-semibold truncate">{movie.title}</h3>
        </div>
        {movie.rating && (
          <div className="flex items-center gap-1">
            <Star size={12} className="text-[#db0000] fill-[#db0000]" />
            <span className="text-white text-xs">{movie.rating}/10</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompactMovieCard;

