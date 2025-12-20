-- Movie Management Database Schema
-- Run this SQL in your Neon PostgreSQL database

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'movie' CHECK (type IN ('movie', 'series')),
  genre JSONB DEFAULT '[]'::jsonb,
  watched BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 10)),
  review TEXT DEFAULT '',
  poster TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on watched status for faster filtering
CREATE INDEX IF NOT EXISTS idx_movies_watched ON movies(watched);

-- Create index on type for faster filtering
CREATE INDEX IF NOT EXISTS idx_movies_type ON movies(type);

-- Create index on priority for sorting
CREATE INDEX IF NOT EXISTS idx_movies_priority ON movies(priority);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_movies_updated_at 
  BEFORE UPDATE ON movies 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add poster column to existing tables (run this if table already exists)
-- ALTER TABLE movies ADD COLUMN IF NOT EXISTS poster TEXT;

-- Example insert (optional - for testing)
-- INSERT INTO movies (title, type, genre, watched, priority, rating, review, poster)
-- VALUES (
--   'The Shawshank Redemption',
--   'movie',
--   '["Drama", "Crime"]'::jsonb,
--   true,
--   5,
--   9,
--   'An inspiring story about hope and friendship. One of the best movies ever made.',
--   'https://example.com/poster.jpg'
-- );

