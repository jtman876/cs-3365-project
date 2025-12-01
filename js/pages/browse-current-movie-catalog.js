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

  // Create a clickable title that links to the movie details page
  const title = document.createElement('h3');
  const movieLink = document.createElement('a');
  movieLink.href = `./movie-details.html?id=${movie.id}`;
  movieLink.textContent = movie.title;
  movieLink.classList.add('movie-link');
  title.appendChild(movieLink);

  // Synopsis
  const synopsisP = document.createElement('p');
  synopsisP.innerHTML = `<strong>Synopsis:</strong> ${movie.synopsis}`;

  // Runtime
  const runtimeP = document.createElement('p');
  runtimeP.innerHTML = `<strong>Runtime:</strong> ${movie.runtime}`;

  // Ticket price
  const priceP = document.createElement('p');
  priceP.innerHTML = `<strong>Ticket Price:</strong> $${movie.ticketPrice}`;

  // Append to card
  card.appendChild(title);
  card.appendChild(synopsisP);
  card.appendChild(runtimeP);
  card.appendChild(priceP);

  // Finally add card to the container
  container.appendChild(card);
});




  } catch (err) {
    console.error('Error in renderCurrentMovies():', err);
    container.textContent = 'Error loading movies.';
  }
}

// Call the function immediately, because the DOM is ready now
renderCurrentMovies();

