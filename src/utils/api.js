/**
 * API utility functions for movie CRUD operations
 * 
 * Example usage:
 * 
 * // GET all movies
 * const movies = await fetchMovies();
 * 
 * // POST - Add a movie
 * const newMovie = await createMovie({
 *   title: "Inception",
 *   type: "movie",
 *   genre: ["Sci-Fi", "Thriller"],
 *   priority: 4,
 *   rating: 9,
 *   review: "Mind-bending masterpiece"
 * });
 * 
 * // PUT - Update movie
 * const updated = await updateMovie(1, {
 *   watched: true,
 *   rating: 9,
 *   review: "Amazing movie!"
 * });
 * 
 * // DELETE - Remove movie
 * await deleteMovie(1);
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetch all movies
 * @returns {Promise<Array>} Array of movie objects
 */
export async function fetchMovies() {
  try {
    const response = await fetch(`${API_BASE_URL}/movies`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

/**
 * Create a new movie
 * @param {Object} movieData - Movie data object
 * @param {string} movieData.title - Movie title (required)
 * @param {string} [movieData.type='movie'] - Type: 'movie' or 'series'
 * @param {Array<string>} [movieData.genre=[]] - Array of genre strings
 * @param {number} [movieData.priority=3] - Priority (1-5)
 * @param {number|null} [movieData.rating=null] - Rating (1-10)
 * @param {string} [movieData.review=''] - Review text
 * @returns {Promise<Object>} Created movie object
 */
export async function createMovie(movieData) {
  try {
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating movie:', error);
    throw error;
  }
}

/**
 * Update a movie
 * @param {number} id - Movie ID
 * @param {Object} updates - Fields to update
 * @param {boolean} [updates.watched] - Watched status
 * @param {string} [updates.review] - Review text
 * @param {number|null} [updates.rating] - Rating (1-10)
 * @param {number} [updates.priority] - Priority (1-5)
 * @returns {Promise<Object>} Updated movie object
 */
export async function updateMovie(id, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        ...updates,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
}

/**
 * Delete a movie
 * @param {number} id - Movie ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteMovie(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/movies?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
}

/**
 * Example: Complete CRUD operations usage
 * 
 * // 1. GET - Fetch all movies
 * const movies = await fetchMovies();
 * console.log('All movies:', movies);
 * 
 * // 2. POST - Add a new movie
 * const newMovie = await createMovie({
 *   title: "The Matrix",
 *   type: "movie",
 *   genre: ["Sci-Fi", "Action"],
 *   priority: 5,
 *   rating: null,
 *   review: ""
 * });
 * console.log('Created:', newMovie);
 * 
 * // 3. PUT - Update watched status and rating
 * const updated = await updateMovie(newMovie.id, {
 *   watched: true,
 *   rating: 9,
 *   review: "Groundbreaking sci-fi film!"
 * });
 * console.log('Updated:', updated);
 * 
 * // 4. PUT - Update only priority
 * await updateMovie(newMovie.id, {
 *   priority: 4
 * });
 * 
 * // 5. DELETE - Remove movie
 * await deleteMovie(newMovie.id);
 * console.log('Movie deleted');
 */

