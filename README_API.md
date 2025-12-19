# Movie Management API Documentation

## Overview

This application uses Vercel Serverless Functions to provide a secure backend API for managing movies. The API connects to a Neon PostgreSQL database and exposes CRUD operations through `/api/movies`.

## Setup

### 1. Database Setup

1. Create a Neon PostgreSQL database at [neon.tech](https://neon.tech)
2. Run the SQL schema from `database/schema.sql` in your Neon SQL editor
3. Copy your database connection string (DATABASE_URL)

### 2. Vercel Configuration

1. Deploy your project to Vercel
2. Go to Project Settings → Environment Variables
3. Add `DATABASE_URL` with your Neon PostgreSQL connection string
4. Redeploy your application

### 3. Local Development

For local development with Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull

# Run development server
vercel dev
```

## API Endpoints

### Base URL

- Production: `https://your-project.vercel.app/api/movies`
- Local: `http://localhost:3000/api/movies`

### GET /api/movies

Fetch all movies.

**Response:**
```json
[
  {
    "id": 1,
    "title": "The Shawshank Redemption",
    "type": "movie",
    "genre": ["Drama", "Crime"],
    "watched": true,
    "priority": 5,
    "rating": 9,
    "review": "An inspiring story...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### POST /api/movies

Add a new movie.

**Request Body:**
```json
{
  "title": "Inception",
  "type": "movie",
  "genre": ["Sci-Fi", "Thriller"],
  "priority": 4,
  "rating": 9,
  "review": "Mind-bending masterpiece"
}
```

**Response:** Created movie object (same structure as GET response)

**Validation:**
- `title` (required): Non-empty string
- `type`: Must be "movie" or "series" (defaults to "movie")
- `priority`: Must be 1-5 (defaults to 3)
- `rating`: Must be 1-10 or null (optional)

### PUT /api/movies

Update a movie's watched status, review, rating, or priority.

**Request Body:**
```json
{
  "id": 1,
  "watched": true,
  "rating": 9,
  "review": "Amazing movie!",
  "priority": 4
}
```

**Response:** Updated movie object

**Note:** You can update any combination of `watched`, `review`, `rating`, and `priority`. At least one field must be provided.

### DELETE /api/movies?id={id}

Delete a movie.

**Query Parameters:**
- `id` (required): Movie ID to delete

**Response:**
```json
{
  "message": "Movie deleted successfully",
  "id": 1
}
```

## Frontend Usage

The frontend uses utility functions from `src/utils/api.js`:

```javascript
import { fetchMovies, createMovie, updateMovie, deleteMovie } from './utils/api';

// Fetch all movies
const movies = await fetchMovies();

// Create a movie
const newMovie = await createMovie({
  title: "The Matrix",
  type: "movie",
  genre: ["Sci-Fi", "Action"],
  priority: 5
});

// Update a movie
await updateMovie(1, {
  watched: true,
  rating: 9,
  review: "Groundbreaking!"
});

// Delete a movie
await deleteMovie(1);
```

## Security Features

1. **Parameterized Queries**: All SQL queries use parameterized statements to prevent SQL injection
2. **Input Validation**: Server-side validation for all inputs
3. **Error Handling**: Proper error handling without exposing sensitive information
4. **CORS**: Configured for cross-origin requests
5. **Environment Variables**: Database credentials stored securely in Vercel environment variables

## Database Schema

The `movies` table structure:

- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR(255), NOT NULL)
- `type` (VARCHAR(50), 'movie' or 'series')
- `genre` (JSONB, array of strings)
- `watched` (BOOLEAN, default false)
- `priority` (INTEGER, 1-5, default 3)
- `rating` (INTEGER, 1-10 or NULL)
- `review` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

Error responses include a JSON object with an `error` field:

```json
{
  "error": "Title is required"
}
```

