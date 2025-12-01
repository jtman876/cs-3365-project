import { getSupabase, getUser, getReviews, submitReview, orderTickets } from '../auth.js';
  
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('id');
  const movieDetails = document.getElementById('movie-details');
  const reviewsSection = document.getElementById('reviews-section');
  const loggedInUser = document.getElementById('logged-in-user');
  const reviewSubmitBtn = document.getElementById('review-submit-btn');
  
  // Get movie details
  async function getMovieDetails() {
    const supabase = getSupabase();
  
    const { data: movie, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', movieId)
      .single();
  
    if (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  
    return movie;
  }
  
  async function loadMovieData() {
    const user = await getUser();
  
    if (user) {
      loggedInUser.textContent = `Logged in as: ${user.email}`;
    }
  
    const movie = await getMovieDetails();
    if (!movie) {
      movieDetails.innerHTML = "<p>Error loading movie details.</p>";
      return;
    }
  
    movieDetails.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">${movie.title}</h2>
      <p class="mb-4">${movie.synopsis}</p>
      <p><strong>Showtime:</strong> ${movie.showtime}</p>
      <p><strong>Price:</strong> $${movie.ticket_price}</p>
  
      <button id="order-ticket-btn" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Order Ticket
      </button>
    `;
  
    document.getElementById('order-ticket-btn').addEventListener('click', async () => {
      if (!user) {
        alert("You must be logged in to order a ticket.");
        return;
      }
  
      const result = await orderTickets(user.id, movieId, movie.ticket_price);
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
      <div class="border p-3 rounded mb-2">
        <p><strong>${review.user_email}</strong> — ${review.rating}/5</p>
        <p>${review.review_text}</p>
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
    const text = document.getElementById('review-text').value;
  
    if (!rating || !text) {
      alert("Please enter both a rating and a review.");
      return;
    }
  
    const success = await submitReview(user.id, movieId, rating, text);
  
    if (success) {
      alert("Review submitted successfully!");
      loadReviews(movieId);
    } else {
      alert("Failed to submit review.");
    }
  });
  
  loadMovieData();
  