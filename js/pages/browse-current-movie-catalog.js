import { getCurrentMovies } from '../auth.js';

console.log('browse-current-movie-catalog.js loaded');

// Function that fetches and displays current movies
async function renderCurrentMovies() {
  console.log('renderCurrentMovies() called');

  const container = document.getElementById('current-movies-list');

  if (!container) {
    console.error('No element with id="current-movies-list" found!');
    return;
  }

  container.textContent = 'Loading current movies...';

  try {
    const movies = await getCurrentMovies();
    console.log('Current movies from getCurrentMovies():', movies);

    container.innerHTML = '';

    if (!Array.isArray(movies) || movies.length === 0) {
      container.textContent = 'No current movies available.';
      return;
    }

  movies.forEach(movie => {
  const card = document.createElement('article');
  card.classList.add('movie-card');

  // Take up to the first 2 showtimes so it doesn't get too long
  const showtimes = (movie.showtimes || [])
    .slice(0, 2)
    .map(time => `<li>${time}</li>`)
    .join('');

  card.innerHTML = `
    <h3>${movie.title}</h3>
    <p><strong>Synopsis:</strong> ${movie.synopsis}</p>
    <p><strong>Runtime:</strong> ${movie.runtime}</p>
    <p><strong>Ticket Price:</strong> $${movie.ticketPrice}</p>
    ${
      showtimes
        ? `<p><strong>Showtimes:</strong></p><ul>${showtimes}</ul>`
        : ''
    }
  `;

  container.appendChild(card);
});

  } catch (err) {
    console.error('Error in renderCurrentMovies():', err);
    container.textContent = 'Error loading movies.';
  }
}

// Call the function immediately, because the DOM is ready now
renderCurrentMovies();

