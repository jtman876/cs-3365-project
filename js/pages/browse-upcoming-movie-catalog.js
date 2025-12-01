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

  // Header row: title on the left, "Upcoming" badge on the right
  const header = document.createElement('div');
  header.classList.add('movie-header');

  // Clickable title -> movie details page
  const title = document.createElement('h3');
  const movieLink = document.createElement('a');
  movieLink.href = `./movie-details.html?id=${movie.id}`;
  movieLink.textContent = movie.title;
  movieLink.classList.add('movie-link');
  title.appendChild(movieLink);

  // Upcoming badge
  const badge = document.createElement('span');
  badge.classList.add('badge');
  badge.textContent = 'Upcoming';

  header.appendChild(title);
  header.appendChild(badge);
  card.appendChild(header);

  // Synopsis
  const synopsisP = document.createElement('p');
  synopsisP.innerHTML = `<strong>Synopsis:</strong> ${movie.synopsis}`;
  card.appendChild(synopsisP);

  // Runtime
  const runtimeP = document.createElement('p');
  runtimeP.innerHTML = `<strong>Runtime:</strong> ${movie.runtime || 'TBD'}`;
  card.appendChild(runtimeP);

  // Ticket price
  const priceP = document.createElement('p');
  priceP.innerHTML = `<strong>Ticket Price:</strong> ${
    movie.ticketPrice ? `$${movie.ticketPrice}` : 'TBD'
  }`;
  card.appendChild(priceP);

  container.appendChild(card);
});


  } catch (err) {
    console.error('Error in renderUpcomingMovies():', err);
    container.textContent = 'Error loading upcoming movies.';
  }
}

renderUpcomingMovies();
