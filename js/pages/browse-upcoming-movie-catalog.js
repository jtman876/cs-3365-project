import { getUpcomingMovies } from '../auth.js';

console.log('browse-upcoming-movie-catalog.js loaded');

async function renderUpcomingMovies() {
  console.log('renderUpcomingMovies() called');

  const container = document.getElementById('upcoming-movies-list');
  if (!container) {
    console.error('No element with id="upcoming-movies-list" found!');
    return;
  }

  container.textContent = 'Loading upcoming movies...';

  try {
    const movies = await getUpcomingMovies();
    console.log('Upcoming movies from getUpcomingMovies():', movies);

    container.innerHTML = '';

    if (!Array.isArray(movies) || movies.length === 0) {
      container.textContent = 'No upcoming movies available.';
      return;
    }

    movies.forEach(movie => {
      const card = document.createElement('article');
      card.classList.add('movie-card');

      card.innerHTML = `
        <h3>${movie.title}</h3>
        <p><strong>Synopsis:</strong> ${movie.synopsis}</p>
        <p><strong>Runtime:</strong> ${movie.runtime}</p>
        <p><strong>Ticket Price:</strong> $${movie.ticketPrice}</p>
        <span class="badge">Coming soon</span>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error in renderUpcomingMovies():', err);
    container.textContent = 'Error loading upcoming movies.';
  }
}

renderUpcomingMovies();
