import pkg from 'pg';
const { Pool } = pkg;

// Create a connection pool
// DATABASE_URL is automatically available from Vercel environment variables
// Pool is created at module level to be reused across serverless function invocations
let pool = null;

try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Neon PostgreSQL
      },
      // Optimize for serverless: fewer connections, shorter idle timeout
      max: 2, // Small pool for serverless function instances
      idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
      connectionTimeoutMillis: 10000 // Fail fast if connection takes too long
    });
  } else {
    console.error('DATABASE_URL environment variable is not set');
  }
} catch (error) {
  console.error('Error creating database pool:', error);
  pool = null;
}

// Helper function to handle database errors
function handleError(error, res) {
  console.error('Database error:', error);
  const isDev = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development';
  
  return res.status(500).json({ 
    error: 'Internal server error',
    message: isDev ? error.message : undefined,
    details: isDev ? error.stack : undefined
  });
}

export default async function handler(req, res) {
  // Ensure we always return JSON, even on unexpected errors
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
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
      switch (req.method) {
        case 'GET':
          return await handleGet(req, res);
        case 'POST':
          return await handlePost(req, res);
        case 'PUT':
          return await handlePut(req, res);
        case 'DELETE':
          return await handleDelete(req, res);
        default:
          return res.status(405).json({ error: 'Method not allowed' });
      }
    } catch (error) {
      return handleError(error, res);
    }
  } catch (error) {
    // Top-level error handler - ensure we always return JSON
    console.error('Unexpected error in handler:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    });
  }
}

// GET - Fetch all movies
async function handleGet(req, res) {
  try {
    const result = await pool.query(
      `SELECT 
        id,
        title,
        type,
        genre,
        watched,
        priority,
        rating,
        review,
        created_at,
        updated_at
      FROM movies 
      ORDER BY created_at DESC`
    );

    // Parse genre array from JSON string or JSONB
    const movies = result.rows.map(row => {
      let genre = [];
      if (row.genre) {
        if (Array.isArray(row.genre)) {
          genre = row.genre;
        } else if (typeof row.genre === 'string') {
          try {
            genre = JSON.parse(row.genre);
          } catch (e) {
            console.warn('Failed to parse genre:', row.genre);
            genre = [];
          }
        } else {
          genre = row.genre;
        }
      }
      return {
        ...row,
        genre: Array.isArray(genre) ? genre : []
      };
    });

    return res.status(200).json(movies);
  } catch (error) {
    console.error('Error in handleGet:', error);
    // Check if table doesn't exist
    if (error.message && error.message.includes('does not exist')) {
      return res.status(500).json({ 
        error: 'Database table not found',
        message: 'The movies table does not exist. Please run the SQL schema from database/schema.sql in your Neon database.'
      });
    }
    return handleError(error, res);
  }
}

// POST - Add a new movie
async function handlePost(req, res) {
  try {
    const { title, type, genre, priority, rating, review } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (type && !['movie', 'series'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either "movie" or "series"' });
    }

    if (priority && (priority < 1 || priority > 5)) {
      return res.status(400).json({ error: 'Priority must be between 1 and 5' });
    }

    if (rating && (rating < 1 || rating > 10)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 10' });
    }

    // Insert movie with parameterized query
    const result = await pool.query(
      `INSERT INTO movies (title, type, genre, watched, priority, rating, review)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING 
         id,
         title,
         type,
         genre,
         watched,
         priority,
         rating,
         review,
         created_at,
         updated_at`,
      [
        title.trim(),
        type || 'movie',
        JSON.stringify(Array.isArray(genre) ? genre : (genre ? [genre] : [])),
        false, // watched defaults to false
        priority || 3,
        rating || null,
        review || ''
      ]
    );

    const movie = {
      ...result.rows[0],
      genre: Array.isArray(result.rows[0].genre) 
        ? result.rows[0].genre 
        : (result.rows[0].genre ? JSON.parse(result.rows[0].genre) : [])
    };

    return res.status(201).json(movie);
  } catch (error) {
    return handleError(error, res);
  }
}

// PUT - Update movie (watched, review, rating, priority)
async function handlePut(req, res) {
  try {
    const { id, watched, review, rating, priority } = req.body;

    // Validation
    if (!id) {
      return res.status(400).json({ error: 'Movie ID is required' });
    }

    if (priority !== undefined && (priority < 1 || priority > 5)) {
      return res.status(400).json({ error: 'Priority must be between 1 and 5' });
    }

    if (rating !== undefined && rating !== null && (rating < 1 || rating > 10)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 10' });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (watched !== undefined) {
      updates.push(`watched = $${paramCount++}`);
      values.push(watched);
    }

    if (review !== undefined) {
      updates.push(`review = $${paramCount++}`);
      values.push(review || '');
    }

    if (rating !== undefined) {
      updates.push(`rating = $${paramCount++}`);
      values.push(rating || null);
    }

    if (priority !== undefined) {
      updates.push(`priority = $${paramCount++}`);
      values.push(priority);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Add updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE movies 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING 
         id,
         title,
         type,
         genre,
         watched,
         priority,
         rating,
         review,
         created_at,
         updated_at`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const movie = {
      ...result.rows[0],
      genre: Array.isArray(result.rows[0].genre) 
        ? result.rows[0].genre 
        : (result.rows[0].genre ? JSON.parse(result.rows[0].genre) : [])
    };

    return res.status(200).json(movie);
  } catch (error) {
    return handleError(error, res);
  }
}

// DELETE - Remove a movie
async function handleDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Movie ID is required' });
    }

    const result = await pool.query(
      'DELETE FROM movies WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    return res.status(200).json({ message: 'Movie deleted successfully', id: parseInt(id) });
  } catch (error) {
    return handleError(error, res);
  }
}

