# Quick Database Setup

## The Error
You're seeing: **"Database table not found"**

This means your `DATABASE_URL` is working, but the `movies` table hasn't been created yet.

## Solution: Create the Table

### Option 1: Using Neon SQL Editor (Recommended)

1. Go to your [Neon Dashboard](https://console.neon.tech)
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Copy and paste the entire contents of `schema.sql` (or see below)
5. Click **"Run"** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### Option 2: Copy-Paste This SQL

```sql
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_movies_watched ON movies(watched);
CREATE INDEX IF NOT EXISTS idx_movies_type ON movies(type);
CREATE INDEX IF NOT EXISTS idx_movies_priority ON movies(priority);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_movies_updated_at 
  BEFORE UPDATE ON movies 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

### Verify It Worked

After running the SQL, test it:

```sql
SELECT * FROM movies;
```

This should return an empty result (no error), meaning the table exists.

## Adding Poster Column (If Table Already Exists)

If you already created the `movies` table before the poster feature was added, you need to add the poster column:

1. Go to your [Neon Dashboard](https://console.neon.tech)
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Run this SQL:

```sql
ALTER TABLE movies ADD COLUMN IF NOT EXISTS poster TEXT;
```

This adds the `poster` column to store movie poster image URLs. Existing movies will have `NULL` for poster, and new movies imported from IMDb will automatically get poster images.

## After Creating the Table

1. Refresh your app - the error should be gone
2. You should see an empty movie list (or you can add your first movie)
3. If you had an existing table, make sure to run the poster column migration above

## Need Help?

If you still get errors after creating the table:
- Make sure you're running the SQL in the correct database
- Check that all SQL statements executed successfully
- Verify the table exists: `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'movies');`

