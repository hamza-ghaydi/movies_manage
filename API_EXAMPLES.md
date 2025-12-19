# API Fetch Examples

Complete examples of fetch calls for all CRUD operations.

## GET - Fetch All Movies

```javascript
const response = await fetch('/api/movies');
const movies = await response.json();
console.log(movies);
```

## POST - Add a Movie

```javascript
const response = await fetch('/api/movies', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: "The Matrix",
    type: "movie",
    genre: ["Sci-Fi", "Action"],
    priority: 5,
    rating: 9,
    review: "Groundbreaking sci-fi film!"
  })
});

const newMovie = await response.json();
console.log('Created:', newMovie);
```

## PUT - Update Movie

### Update watched status and rating:

```javascript
const response = await fetch('/api/movies', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 1,
    watched: true,
    rating: 9,
    review: "Amazing movie!"
  })
});

const updated = await response.json();
console.log('Updated:', updated);
```

### Update only priority:

```javascript
const response = await fetch('/api/movies', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 1,
    priority: 4
  })
});

const updated = await response.json();
```

### Update only review:

```javascript
const response = await fetch('/api/movies', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 1,
    review: "New review text here"
  })
});

const updated = await response.json();
```

## DELETE - Remove a Movie

```javascript
const response = await fetch('/api/movies?id=1', {
  method: 'DELETE'
});

const result = await response.json();
console.log(result); // { message: "Movie deleted successfully", id: 1 }
```

## Error Handling Example

```javascript
try {
  const response = await fetch('/api/movies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: "New Movie"
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  const movie = await response.json();
  console.log('Success:', movie);
} catch (error) {
  console.error('Error:', error.message);
}
```

## Using the API Utility Functions

The app includes utility functions in `src/utils/api.js`:

```javascript
import { fetchMovies, createMovie, updateMovie, deleteMovie } from './utils/api';

// GET all movies
const movies = await fetchMovies();

// POST - Create movie
const newMovie = await createMovie({
  title: "Inception",
  type: "movie",
  genre: ["Sci-Fi", "Thriller"],
  priority: 4
});

// PUT - Update movie
await updateMovie(1, {
  watched: true,
  rating: 9,
  review: "Mind-bending!"
});

// DELETE - Remove movie
await deleteMovie(1);
```

