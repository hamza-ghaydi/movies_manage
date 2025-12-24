import { useState } from 'react';
import { Plus, X } from 'lucide-react';

function MovieForm({ isOpen, onClose, onAddMovie }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'movie',
    genre: '',
    priority: 3,
    rating: '',
    review: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    const newMovie = {
      id: Date.now(),
      title: formData.title.trim(),
      type: formData.type,
      genre: formData.genre ? formData.genre.split(',').map(g => g.trim()).filter(g => g) : [],
      watched: false,
      priority: parseInt(formData.priority),
      rating: formData.rating ? parseInt(formData.rating) : null,
      review: formData.review.trim()
    };

    onAddMovie(newMovie);

    setFormData({
      title: '',
      type: 'movie',
      genre: '',
      priority: 3,
      rating: '',
      review: ''
    });

    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/5 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-strong rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between sticky top-0 glass border-b border-[#db0000] border-opacity-20 p-6">
          <h2 className="text-2xl font-bold text-white">Add New Movie or Series</h2>
          <button
            onClick={onClose}
            className="text-[#564d4d] hover:text-white transition-colors cursor-pointer"
          >
            <X size={24}  />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 glass-light rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#db0000] focus:border-[#db0000] focus:border-opacity-40"
                placeholder="Enter title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 glass-light rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#db0000] focus:border-[#db0000] focus:border-opacity-40"
              >
                <option value="movie" className="bg-black">Movie</option>
                <option value="series" className="bg-black">Series</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Genre (comma separated)
              </label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-3 py-2 glass-light rounded-xl text-white placeholder-[#564d4d] focus:outline-none focus:ring-2 focus:ring-[#db0000] focus:border-[#db0000] focus:border-opacity-40"
                placeholder="e.g. Action, Drama, Sci-Fi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Priority (1-5)
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 glass-light rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#db0000] focus:border-[#db0000] focus:border-opacity-40"
              >
                <option value="1" className="bg-black">1 - Low</option>
                <option value="2" className="bg-black">2</option>
                <option value="3" className="bg-black">3 - Medium</option>
                <option value="4" className="bg-black">4</option>
                <option value="5" className="bg-black">5 - High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Rating (1-10, optional)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full px-3 py-2 glass-light rounded-xl text-white placeholder-[#564d4d] focus:outline-none focus:ring-2 focus:ring-[#db0000] focus:border-[#db0000] focus:border-opacity-40"
                placeholder="1-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Review
            </label>
            <textarea
              name="review"
              value={formData.review}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 glass-light rounded-xl text-white placeholder-[#564d4d] focus:outline-none focus:ring-2 focus:ring-[#db0000] focus:border-[#db0000] focus:border-opacity-40"
              placeholder="Write your thoughts..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-950/90 hover:bg-blue-950/90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus size={20} />
              Add to Collection
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#4d4d56] hover:bg-[#3b3c47] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MovieForm;
