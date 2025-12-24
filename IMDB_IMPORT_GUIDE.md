# IMDb Import Feature Guide

## Overview

This feature allows users to import movie/series information directly from IMDb by providing an IMDb link. The backend fetches data from the OMDb API and saves it to your Neon PostgreSQL database.

## Architecture

```
Frontend (React)
    ↓ POST /api/movies/import
    ↓ { "imdbLink": "https://www.imdb.com/title/tt3896198/" }
Backend (Vercel Serverless Function)
    ↓ Extract IMDb ID (tt3896198)
    ↓ Fetch from OMDb API (http://www.omdbapi.com/?i=tt3896198&apikey=...)
    ↓ Map OMDb data to database schema
    ↓ Save to Neon PostgreSQL
    ↑ Return imported movie
Frontend receives movie data
```

## Setup

### 1. Environment Variables

Add the OMDb API key to Vercel environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - **Key**: `OMDB_API_KEY`
   - **Value**: `fb33bf5` (or your own API key)
   - **Environment**: Production, Preview, Development
3. Redeploy your application

**Note**: The API key is stored server-side and never exposed to the frontend.

### 2. Required NPM Packages

No additional packages needed! The implementation uses:
- ✅ `pg` (already installed) - PostgreSQL client
- ✅ Built-in `fetch` (Node.js 18+) - HTTP requests (no `node-fetch` needed)

## API Endpoint

### POST `/api/movies/import`

**Request:**
```json
{
  "imdbLink": "https://www.imdb.com/title/tt3896198/"
}
```

**Response (Success - 201):**
```json
{
  "message": "Movie imported successfully",
  "movie": {
    "id": 1,
    "title": "Guardians of the Galaxy Vol. 2",
    "type": "movie",
    "genre": ["Action", "Adventure", "Comedy"],
    "watched": false,
    "priority": 3,
    "rating": 8,
    "review": "The Guardians must fight to keep their newfound family together...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "error": "Invalid IMDb link",
  "message": "Could not extract IMDb ID from the provided link..."
}
```

**Response (Error - 409):**
```json
{
  "error": "Movie already exists",
  "message": "A movie with the title \"...\" already exists in the database"
}
```

## Frontend Usage

### Basic Example

```javascript
import { importMovieFromImdb } from './utils/api';

// Import a movie
try {
  const result = await importMovieFromImdb("https://www.imdb.com/title/tt3896198/");
  console.log('Imported:', result.movie);
  alert('Movie imported successfully!');
} catch (error) {
  console.error('Import failed:', error);
  alert(`Failed to import: ${error.message}`);
}
```

### React Component Example

```jsx
import { useState } from 'react';
import { importMovieFromImdb } from './utils/api';

function ImportMovieForm({ onImportSuccess }) {
  const [imdbLink, setImdbLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imdbLink.trim()) {
      setError('Please enter an IMDb link');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await importMovieFromImdb(imdbLink.trim());
      
      // Success!
      setImdbLink('');
      if (onImportSuccess) {
        onImportSuccess(result.movie);
      }
      alert(`Successfully imported: ${result.movie.title}`);
    } catch (err) {
      setError(err.message || 'Failed to import movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          IMDb Link or ID
        </label>
        <input
          type="text"
          value={imdbLink}
          onChange={(e) => setImdbLink(e.target.value)}
          placeholder="https://www.imdb.com/title/tt3896198/ or tt3896198"
          className="w-full px-3 py-2 border rounded-md"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        {loading ? 'Importing...' : 'Import from IMDb'}
      </button>
    </form>
  );
}

export default ImportMovieForm;
```

### Direct Fetch Example (Without Utility)

```javascript
async function importMovie(imdbLink) {
  try {
    const response = await fetch('/api/movies/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imdbLink }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error);
    }

    const result = await response.json();
    return result.movie;
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
}

// Usage
const movie = await importMovie('https://www.imdb.com/title/tt3896198/');
```

## Supported IMDb Link Formats

The function accepts various formats:

- ✅ `https://www.imdb.com/title/tt3896198/`
- ✅ `http://www.imdb.com/title/tt3896198`
- ✅ `https://imdb.com/title/tt3896198/`
- ✅ `tt3896198` (just the ID)

## Data Mapping

OMDb API fields are mapped to your database schema:

| OMDb Field | Database Field | Transformation |
|------------|---------------|----------------|
| `Title` | `title` | Direct mapping |
| `Type` | `type` | "Movie" → "movie", "Series" → "series" |
| `Genre` | `genre` | Comma-separated → JSON array |
| `imdbRating` | `rating` | Float (0-10) → Integer (1-10) |
| `Plot` | `review` | Direct mapping (or empty if N/A) |
| - | `watched` | Default: `false` |
| - | `priority` | Default: `3` |

## Error Handling

The API returns appropriate HTTP status codes:

- **200/201**: Success
- **400**: Bad Request (invalid link, missing field)
- **404**: Movie not found in OMDb
- **409**: Movie already exists in database
- **500**: Internal server error

## Security

- ✅ OMDb API key stored in Vercel environment variables
- ✅ API key never exposed to frontend
- ✅ Server-side validation of IMDb links
- ✅ Parameterized SQL queries (SQL injection protection)
- ✅ Duplicate movie detection

## Testing

Test with these IMDb links:

```javascript
// Movie
await importMovieFromImdb('https://www.imdb.com/title/tt1375666/'); // Inception

// Series
await importMovieFromImdb('https://www.imdb.com/title/tt0944947/'); // Game of Thrones

// Just ID
await importMovieFromImdb('tt3896198'); // Guardians of the Galaxy Vol. 2
```

## Troubleshooting

### "Movie not found"
- Verify the IMDb ID is correct
- Check OMDb API key is set correctly
- Some very new titles may not be in OMDb yet

### "Movie already exists"
- The movie with the same title already exists
- Remove the duplicate check in `api/movies/import/index.js` if you want to allow duplicates

### "Invalid IMDb link"
- Ensure the link contains a valid IMDb ID (starts with `tt` followed by numbers)
- Try using just the ID: `tt3896198`




