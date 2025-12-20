-- Migration: Add poster column to existing movies table
-- Run this SQL in your Neon PostgreSQL database if you already have the movies table

-- Add poster column if it doesn't exist
ALTER TABLE movies ADD COLUMN IF NOT EXISTS poster TEXT;

-- The column will be NULL for existing movies
-- New movies imported from IMDb will automatically have poster URLs

