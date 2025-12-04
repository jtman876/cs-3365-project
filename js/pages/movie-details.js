import { Theater, getUser, getMovieById, getReviews, submitReview, orderTickets } from '../auth.js';

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const movieDetails = document.getElementById('movie-container');
const orderContainer = document.getElementById('order-container');
const reviewsSection = document.getElementById('reviews-list');
const reviewSubmitBtn = document.getElementById('submit-review');
const showtimeSelect = document.getElementById('showtime-select');
const theaterSelect = document.getElementById('theater-select');
const numInput = document.getElementById('num-seats');

async function loadMovieData() {
  const user = await getUser();

  if (!user) {
    movieDetails.innerHTML = "<p>You must be logged in to view movie details</p>";
    return;
  }

  const movie = await getMovieById(movieId);
  if (!movie) {
    movieDetails.innerHTML = "<p>Error loading movie details.</p>";
    return;
  }

  if (!movie.isCurrent) {
    orderContainer.style.display = "none";
  }

  movieDetails.innerHTML = `
    <h2>${movie.title}</h2>
    <h3 style="text-align:center;margin-top:-1rem;">${movie.isCurrent ? "Current" : "Upcoming"}</h3>
    <p>${movie.synopsis}</p>
    <p><strong>Runtime:</strong> ${movie.runtime}</p>
    <p><strong>Cast:</strong><ul>${movie.cast.map(member => `<p style="font-weight:bold;margin-bottom:-1rem;">${member[0]}</p><p>${member[1]}</p>`).join('')}</ul></p>
    <p><strong>Showtimes:</strong><ul>${movie.showtimes.map(showtime => `<li>${showtime.toUTCString()}</li>`).join('')}</ul></p>
    <p><strong>Price:</strong> $${movie.ticketPrice}</p>
  `;

  for (let showtime of movie.showtimes) {
    const showtimeOption = document.createElement('option');
    showtimeOption.value = showtime;
    showtimeOption.textContent = showtime.toUTCString();
    showtimeSelect.append(showtimeOption);
  }

  for (const key in Theater) {
    const theaterOption = document.createElement('option');
    theaterOption.value = key;
    theaterOption.textContent = Theater[key];
    theaterSelect.append(theaterOption);
  }

  document.getElementById('order-btn').addEventListener('click', async () => {
    if (numInput.value > 10) {
      alert('Max number of tickets is 10!');
      return;
    }

    const result = await orderTickets(movie, new Date(showtimeSelect.value), Theater[theaterSelect.value], numInput.value);
    if (result) {
      alert("Ticket ordered successfully!");
    } else {
      alert("Failed to order ticket.");
    }
  });

  loadReviews(movieId);
}

async function loadReviews(movieId) {
  const reviews = await getReviews(movieId);

  if (!reviews || reviews.length === 0) {
    reviewsSection.innerHTML = "<p>No reviews yet.</p>";
    return;
  }

  reviewsSection.innerHTML = reviews.map(review => `
    <div class="review">
      <p><strong>${review.name}</strong> — ${review.rating}/5</p>
      <p>${review.content}</p>
    </div>
  `).join('');
}

// Handle review submission
reviewSubmitBtn.addEventListener('click', async () => {
  const user = await getUser();
  if (!user) {
    alert("You must be logged in to submit a review.");
    return;
  }

  const rating = document.getElementById('review-rating').value;
  const text = document.getElementById('review-content').value;

  if (!rating || !text) {
    alert("Please enter both a rating and a review.");
    return;
  }

  const success = await submitReview(movieId, rating, text);

  if (success) {
    alert("Review submitted successfully!");
    loadReviews(movieId);
  } else {
    alert("Failed to submit review.");
  }
});

loadMovieData();

