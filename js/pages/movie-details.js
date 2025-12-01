import {  getSupabase, getUser, getReviews, submitReview, orderTicket, submitReview } from '../auth.js'
(async function run() {
    // helper: parse query params
    function getQueryParam(name) {
      const url = new URL(window.location.href);
      return url.searchParams.get(name);
    }
  
    const movieIdParam = getQueryParam('id');
  
    // If no id provided: try to load by title param? fallback to searching "Lord" sample
    let movieId = movieIdParam ? Number(movieIdParam) : null;
  
    // Locate DOM elements
    const movieContainer = document.getElementById('movie-container');
    const reviewsList = document.getElementById('reviews-list');
    const showtimeSelect = document.getElementById('showtime-select');
    const theaterSelect = document.getElementById('theater-select');
    const numSeatsInput = document.getElementById('num-seats');
    const orderBtn = document.getElementById('order-btn');
    const orderResult = document.getElementById('order-result');
    const reviewRating = document.getElementById('review-rating');
    const reviewContent = document.getElementById('review-content');
    const submitReviewBtn = document.getElementById('submit-review');
  
    // load movie; if no id, load first result from searchMovies('Lord') as example
    let movie = null;
    try {
      if (movieId) {
        // Attempt to fetch single movie by id via Supabase directly (no helper exists)
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .eq('id', movieId)
          .single();
  
        if (error) {
          console.error('Error loading movie by id:', error);
        } else {
          movie = data;
        }
      }
  
      if (!movie) {
        // fallback: search by title "Lord" (use existing helper searchMovies if available)
        if (typeof searchMovies === 'function') {
          const results = await searchMovies('Lord');
          if (results && results.length > 0) movie = results[0];
        }
      }
    } catch (err) {
      console.error(err);
    }
  
    if (!movie) {
      movieContainer.innerHTML = '<p>Movie not found.</p>';
      return;
    }
  
    // Render movie details
    function formatShowtime(s) {
      try {
        const d = new Date(s);
        return d.toLocaleString();
      } catch {
        return String(s);
      }
    }
  
    movieContainer.innerHTML = `
      <h1>${movie.title}</h1>
      <p><strong>Runtime:</strong> ${movie.runtime ?? 'n/a'}</p>
      <p><strong>Synopsis:</strong> ${movie.synopsis ?? ''}</p>
      <p><strong>Ticket price:</strong> $${(movie.ticketPrice ?? movie.ticket_price ?? 0).toFixed(2)}</p>
      <h4>Cast</h4>
      <ul id="cast-list"></ul>
    `;
  
    const castList = document.getElementById('cast-list');
    if (movie.cast && Array.isArray(movie.cast)) {
      movie.cast.forEach(c => {
        // c may be [actor, role] or string
        if (Array.isArray(c)) {
          const li = document.createElement('li');
          li.textContent = `${c[0]} as ${c[1]}`;
          castList.appendChild(li);
        } else {
          const li = document.createElement('li');
          li.textContent = c;
          castList.appendChild(li);
        }
      });
    }
  
    // populate showtimes
    const showtimes = movie.showtimes || [];
    showtimeSelect.innerHTML = '';
    if (showtimes.length === 0) {
      const opt = document.createElement('option');
      opt.text = 'No showtimes';
      opt.value = '';
      showtimeSelect.appendChild(opt);
    } else {
      showtimes.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st;
        opt.text = formatShowtime(st);
        showtimeSelect.appendChild(opt);
      });
    }
  
    // Load reviews
    async function loadReviews() {
      reviewsList.innerHTML = '<p>Loading reviews...</p>';
      try {
        const reviews = await getReviews(movie.id);
        if (!reviews || reviews.length === 0) {
          reviewsList.innerHTML = '<p>No reviews yet.</p>';
          return;
        }
        reviewsList.innerHTML = '';
        reviews.forEach(r => {
          const div = document.createElement('div');
          div.className = 'review';
          const rating = document.createElement('div');
          rating.textContent = `Rating: ${r.rating}/5`;
          const body = document.createElement('p');
          body.textContent = r.content;
          const meta = document.createElement('small');
          meta.textContent = `by ${r.user_id ?? 'anonymous'} on ${new Date(r.created_at ?? r.createdAt ?? Date.now()).toLocaleString()}`;
          div.appendChild(rating);
          div.appendChild(body);
          div.appendChild(meta);
          reviewsList.appendChild(div);
        });
      } catch (err) {
        console.error(err);
        reviewsList.innerHTML = '<p>Error loading reviews.</p>';
      }
    }
  
    await loadReviews();
  
    // Submit review
    submitReviewBtn.addEventListener('click', async () => {
      const rating = Number(reviewRating.value);
      const content = reviewContent.value.trim();
      if (!content) {
        alert('Please write a review.');
        return;
      }
      try {
        const ok = await submitReview(movie.id, rating, content);
        if (ok) {
          reviewContent.value = '';
          await loadReviews();
          alert('Review submitted!');
        } else {
          alert('Failed to submit review.');
        }
      } catch (err) {
        console.error(err);
        alert('Error submitting review.');
      }
    });
  
    // Order tickets
    orderBtn.addEventListener('click', async () => {
      const numSeats = Number(numSeatsInput.value) || 1;
      const showtime = showtimeSelect.value;
      const theater = theaterSelect.value;
  
      if (!showtime) {
        alert('Please select a showtime.');
        return;
      }
  
      orderBtn.disabled = true;
      orderResult.textContent = 'Processing order...';
  
      try {
        const barcodes = await orderTickets(
          {
            id: movie.id,
            ticketPrice: movie.ticketPrice ?? movie.ticket_price ?? 0
          },
          showtime,
          theater,
          numSeats
        );
  
        if (!barcodes) {
          orderResult.textContent = 'Order failed.';
          orderBtn.disabled = false;
          return;
        }
  
        orderResult.innerHTML = `<p>Order successful! Tickets: ${barcodes.join(', ')}</p>
          <p><a href="./order-history.html">View order history</a></p>`;
      } catch (err) {
        console.error(err);
        orderResult.textContent = 'Error placing order.';
      } finally {
        orderBtn.disabled = false;
      }
    });
  
  })();
