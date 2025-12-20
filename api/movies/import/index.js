import pkg from 'pg';
const { Pool } = pkg;

// OMDb API key - should be set in Vercel environment variables
// Get your free API key from http://www.omdbapi.com/apikey.aspx
const OMDB_API_KEY = process.env.OMDB_API_KEY || 'fb33bf5'; // Fallback to provided key (may be rate-limited)
const OMDB_API_URL = 'https://www.omdbapi.com/'; // Use HTTPS for security

// Create a connection pool
let pool = null;

try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Neon PostgreSQL
      },
      max: 2,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });
  } else {
    console.error('DATABASE_URL environment variable is not set');
  }
} catch (error) {
  console.error('Error creating database pool:', error);
  pool = null;
}

/**
 * Extract IMDb ID from various link formats:
 * - https://www.imdb.com/title/tt3896198/
 * - https://www.imdb.com/title/tt3896198
 * - http://imdb.com/title/tt3896198/
 * - tt3896198
 */
function extractImdbId(imdbLink) {
  if (!imdbLink || typeof imdbLink !== 'string') {
    return null;
  }

  // If it's already just an ID (starts with tt)
  if (/^tt\d+$/.test(imdbLink.trim())) {
    return imdbLink.trim();
  }

  // Extract from URL patterns
  const patterns = [
    /imdb\.com\/title\/(tt\d+)/i,
    /\/title\/(tt\d+)/i,
    /(tt\d+)/i
  ];

  for (const pattern of patterns) {
    const match = imdbLink.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Fetch movie data from OMDb API
 */
async function fetchFromOmdb(imdbId) {
  const url = `${OMDB_API_URL}?i=${imdbId}&apikey=${OMDB_API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('OMDb API key is invalid or missing. Please set OMDB_API_KEY in Vercel environment variables.');
      }
      throw new Error(`OMDb API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.Response === 'False') {
      // Check if it's an API key error
      if (data.Error && data.Error.includes('API key')) {
        throw new Error('OMDb API key is invalid or missing. Please set OMDB_API_KEY in Vercel environment variables.');
      }
      throw new Error(data.Error || 'Movie not found in OMDb');
    }

    return data;
  } catch (error) {
    console.error('Error fetching from OMDb:', error);
    throw error;
  }
}

/**
 * Map OMDb data to our database schema
 */
function mapOmdbToMovie(omdbData) {
  // Determine type: Movie or Series
  const type = omdbData.Type === 'series' ? 'series' : 'movie';

  // Parse genre from comma-separated string to array
  const genre = omdbData.Genre 
    ? omdbData.Genre.split(',').map(g => g.trim()).filter(g => g)
    : [];

  // Convert IMDb rating (0-10) to integer, or null if not available
  let rating = null;
  if (omdbData.imdbRating && omdbData.imdbRating !== 'N/A') {
    const parsedRating = parseFloat(omdbData.imdbRating);
    if (!isNaN(parsedRating)) {
      rating = Math.round(parsedRating); // Round to nearest integer
    }
  }

  // Use Plot as initial review, or empty string
  const review = omdbData.Plot && omdbData.Plot !== 'N/A' ? omdbData.Plot : '';

  // Get poster URL from OMDb API (Poster field)
  const poster = omdbData.Poster && omdbData.Poster !== 'N/A' ? omdbData.Poster : null;

  return {
    title: omdbData.Title || 'Untitled',
    type: type,
    genre: genre,
    watched: false, // Default to unwatched
    priority: 3, // Default priority
    rating: rating,
    review: review,
    poster: poster
  };
}

/**
 * Check if movie already exists by title
 */
async function movieExists(title) {
  try {
    const result = await pool.query(
      'SELECT id FROM movies WHERE LOWER(title) = LOWER($1) LIMIT 1',
      [title]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking if movie exists:', error);
    return false;
  }
}

/**
 * Save movie to database
 */
async function saveMovieToDb(movieData) {
  try {
    const result = await pool.query(
      `INSERT INTO movies (title, type, genre, watched, priority, rating, review, poster)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING 
         id,
         title,
         type,
         genre,
         watched,
         priority,
         rating,
         review,
         poster,
         created_at,
         updated_at`,
      [
        movieData.title,
        movieData.type,
        JSON.stringify(movieData.genre),
        movieData.watched,
        movieData.priority,
        movieData.rating,
        movieData.review,
        movieData.poster
      ]
    );

    const movie = {
      ...result.rows[0],
      genre: Array.isArray(result.rows[0].genre) 
        ? result.rows[0].genre 
        : (result.rows[0].genre ? JSON.parse(result.rows[0].genre) : [])
    };

    return movie;
  } catch (error) {
    console.error('Error saving movie to database:', error);
    throw error;
  }
}

// Main handler
export default async function handler(req, res) {
  // Ensure we always return JSON
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    // Check if database is configured
    if (!process.env.DATABASE_URL || !pool) {
      console.error('DATABASE_URL is not configured');
      return res.status(500).json({ 
        error: 'Database configuration error',
        message: 'DATABASE_URL environment variable is not set. Please configure it in Vercel project settings.'
      });
    }

    try {
      // Validate request body
      const { imdbLink } = req.body;

      if (!imdbLink) {
        return res.status(400).json({ 
          error: 'Missing required field',
          message: 'imdbLink is required in request body'
        });
      }

      // Extract IMDb ID
      const imdbId = extractImdbId(imdbLink);

      if (!imdbId) {
        return res.status(400).json({ 
          error: 'Invalid IMDb link',
          message: 'Could not extract IMDb ID from the provided link. Please provide a valid IMDb URL or ID (e.g., tt3896198)'
        });
      }

      // Fetch data from OMDb API
      let omdbData;
      try {
        omdbData = await fetchFromOmdb(imdbId);
      } catch (error) {
        return res.status(404).json({ 
          error: 'Movie not found',
          message: error.message || 'Could not fetch movie data from OMDb API'
        });
      }

      // Map OMDb data to our schema
      const movieData = mapOmdbToMovie(omdbData);

      // Check if movie already exists (optional - you can remove this if you want duplicates)
      const exists = await movieExists(movieData.title);
      if (exists) {
        return res.status(409).json({ 
          error: 'Movie already exists',
          message: `A movie with the title "${movieData.title}" already exists in the database`
        });
      }

      // Save to database
      const savedMovie = await saveMovieToDb(movieData);

      return res.status(201).json({
        message: 'Movie imported successfully',
        movie: savedMovie
      });

    } catch (error) {
      console.error('Error in import handler:', error);
      
      const isDev = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development';
      
      return res.status(500).json({ 
        error: 'Internal server error',
        message: isDev ? error.message : 'Failed to import movie. Please try again.'
      });
    }
  } catch (error) {
    // Top-level error handler - ensure we always return JSON
    console.error('Unexpected error in import handler:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    });
  }
}
