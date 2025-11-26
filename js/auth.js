/**
 * @fileoverview Helper functions for accessing Supabase.
 * Typically, you should first check if the user is logged in with getUser.
 * Then, you can add or remove objects from the database with these functions.
 * TODO: refactor database table names into an enum
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

/** @enum {string} All movie theater locations. */
export const Theater = Object.freeze({
  LUBBOCK: 'Lubbock',
  AMARILLO: 'Amarillo',
  LEVELLAND: 'Levelland',
  PLAINVIEW: 'Plainview',
  SNYDER: 'Snyder',
  ABILENE: 'Abilene'
});

/** @enum {string} Permission level of the user. */
export const Role = Object.freeze({
  CUSTOMER: 'Customer',
  ADMIN: 'Admin'
});

/** @enum {string} Status for movie tickets. */
export const TicketStatus = Object.freeze({
  VALID: "valid",
  USED: "used",
  EXPIRED: "expired"
})

let supabaseClient;
let authSubscription;

// movie1 is an example of how to structure a movie for the database
let movie1 = {
  id: 1,
  isCurrent: true,
  title: "Lord of the Rings",
  synopsis: "Synposis goes here",
  cast: [
    ["Actor 1", "Character 1"],
    ["Actor 2", "Character 2"],
  ],
  ticketPrice: 2.44,
  runtime: "1 hr 28 min",
  showtimes: [
    new Date(),
  ]
}

// TODO: Remove later - testing movie retrieval from Supabase
let user1 = await getUser();
if (user1) {
  // let movies = await getCurrentMovies();
  let movies = await searchMovies('Lord');
  if (movies) {
    movies[0].showtimes.push(new Date());

    // let reviews = await getReviews(movies[0].id);
    // console.log(reviews);

    // updateProfile("John Doe", "jtman876@gmail.com", "1234 56th St.", "+12223334444")

    // submitReview(movies[0].id, 4, 'This is the greatest movie I\'ve ever seen!');
    // let tickets = await orderTickets(movies[0], movies[0].showtimes[0], Theater.AMARILLO, 1);
    // console.log('Barcodes: ', tickets)
  }
}

/**
 * Returns a User object with personal information, or null if there is no user logged in
 * TODO: change to auth.getUser
 */
export async function getUser() {
  const supabase = getSupabase();
  const { data: { session }} = await supabase.auth.getSession();
  if (!session) {
    return null;
  }

  setupAuthlistener();

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.user_metadata.display_name,
    address: session.user.user_metadata.address,
    phone: session.user.user_metadata.phone,
    role: session.user.user_metadata.role
  }
}

/**
 * Takes email and password and attempts to authenticate them with Supabase.
 * @returns {boolean} Whether the user was sucessfully signed in. 
 */
export async function login(email, password) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if (error) {
    console.log(error);
    return false;
  }

  setupAuthlistener();
  return true;
}

/**
 * Register a user with Supabase.
 * @returns {boolean} If the registration was successful.
 */
export async function register(name, email, address, phone, password) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: name,
          phone: phone,
          address: address,
          role: Roles.CUSTOMER,
        }
      }
    }
  )

  if (error) {
    console.log(error);
    return false;
  }

  return true;
}

/**
 * Signs out the user
 * @returns {boolean} Whether the user was signed out.
 */
export async function logoutUser() {
  const supabase = getSupabase()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error);
    return false;
  }
  return true; 
}

/**
 * Update the user's information
 * @returns {boolean} Whether the update was successful.
 */
export async function updateProfile(name, email, address, phone) {
  const supabase = getSupabase();
  const user = getUser();
  if (!user) {
    console.log("Unable to update profile: user not found");
    return false;
  }
  const { data, error } = await supabase.auth.updateUser({
    email: email,
    data: {
      display_name: name,
      address: address,
      phone: phone,
      role: user.role
    }
  })
  
  if (error) {
    console.log(error);
    return false;
  }
  return true;
}

/**
 *
 * Retrieves all movie tickets that the user has ordered
 * TODO: Specify return and retrieve movie titles to go with tickets
 */
export async function getOrderHistory() {
  const supabase = getSupabase();
  const user = getUser();

  const { data: tickets, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.log(error);
    return null;
  }
  return tickets;
}

/**
 * Gets the current movies from the database and returns a list of movie objects
 */
export async function getCurrentMovies() {
  const supabase = getSupabase();
  const { data: currentMovies, error } = await supabase
    .from('movies')
    .select(`
      id,
      isCurrent:is_current,
      title,
      synopsis,
      cast,
      runtime,
      showtimes,
      ticketPrice:ticket_price
      `)  
    .eq('is_current', true);

  if (error) {
    console.error('Error fetching current movies: ', error)
    return null;
  }

  return parseMovies(currentMovies);
}

/**
 * Gets the upcoming movies from the database and returns a list of movie objects
 */
export async function getUpcomingMovies() {
  const supabase = getSupabase();
  const { data: upcomingMovies, error } = await supabase
    .from('movies')
    .select(`
      id,
      isCurrent:is_current,
      title,
      synopsis,
      cast,
      runtime,
      showtimes,
      ticketPrice:ticket_price
      `)
    .eq('is_current', false);

  if (error) {
    console.error('Error fetching upcoming movies: ', error)
    return null;
  }

  return parseMovies(upcomingMovies);
}

/**
 * Search all movies by title and returns a list of movie objects
 */
export async function searchMovies(title) {
  const supabase = getSupabase();
  const { data: movies, error } = await supabase
    .from('movies')
    .select(`
      id,
      isCurrent:is_current,
      title,
      synopsis,
      cast,
      runtime,
      showtimes,
      ticketPrice:ticket_price
      `)
    .textSearch('title', `'Lord'`);

  if (error) {
    console.error('Error searching movies: ', error)
    return null;
  }

  return parseMovies(movies);
}

/**
 * Receives ticket information and generates barcodes.
 * No need to send payment information to the database - it is automatically accepted
 * @param numSeats - The number of seats to book, which determines how many tickets are generated
 * @returns {number[]|null} The unique barcodes for the tickets ordered, or null if no tickets were successfully generated
 */
export async function orderTickets(movie, showtime, theater, numSeats) {
  const supabase = getSupabase();
  const user = await getUser();
  let barcodes = [];
  console.log('Ordering ticket: ', movie.id, user.id, movie.ticketPrice, theater, showtime);

  for (let i = 0; i < numSeats; i++) {
    const { data: barcode, error } = await supabase
      .from('tickets')
      .insert({
        movie_id: movie.id,
        user_id: user.id,
        price: movie.ticketPrice,
        theater: theater,
        showtime: showtime,
        status: TicketStatus.VALID
      }).select('id');
    barcodes.push(barcode[0].id);
    if (error) {
      console.log(error);
      return barcodes.length != 0 ? barcodes : null;
    }
  }
  return barcodes;
}

/**
 * Get all the reviews written for a movie
 * TODO: create a separate profiles table or add names to the reviews table
 */
export async function getReviews(movieId) {
  const supabase = getSupabase();
  const user = await getUser();

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select()
    .eq('movie_id', movieId);

  if (error) {
    console.log(error);
    return null;
  }

  return reviews;
}

/**
 * Write a user review for a movie
 * @param {number} movieId - The id of the movie being reviewed
 * @param {number} rating - The rating 1 to 5 stars given by the user
 * @param {string} content - The content of the review
 * @returns {boolean} Whether the review was successfully uploaded
 */
export async function submitReview(movieId, rating, content) {
  const supabase = getSupabase();
  const user = await getUser();

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      movie_id: movieId,
      user_id: user.id,
      rating: rating,
      content: content
    });
  if (error) {
    console.log(error);
    return false;
  }
  return true;
}

/**
 * Allows admins to add movies to the database
 */
export async function addMovie(movie) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('movies')
    .insert({
      is_current: movie.isCurrent,
      title: movie.title,
      synopsis: movie.synopsis,
      cast: movie.cast,
      runtime: movie.runtime,
      showtimes: movie.showtimes,
      ticket_price: movie.ticketPrice,
    });

  if (error) {
    console.log(error);
    return null;
  }
}

/**
 * Takes a new movie and replaced the old one with the same id
 * @returns {boolean} If the movie was sucessfully updated
 */
export async function updateMovie(movie) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('movies')
    .update({
      is_current: movie.isCurrent,
      title: movie.title,
      synopsis: movie.synopsis,
      cast: movie.cast,
      runtime: movie.runtime,
      showtimes: movie.showtimes,
      ticket_price: movie.ticketPrice,
    })
    .eq('id', movie.id)

  if (error) {
    console.log(error);
    return false;
  }
  return true;
}

/**
 * Delete a movie by id
 * @returns {boolean} If the movie was sucessfully deleted
 */
export async function removeMovie(movieId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('movies')
    .delete()
    .eq('id', movieId);

  if (error) {
    console.log(error);
    return false;
  }
  return true;
}

// TODO: get the top selling movies
export async function getStatus() {
  let status; 
  const supabase = getSupabase();
  const { count, data, error } = await supabase
    .from('tickets')
    .select('price.sum()', { count: "exact"});

  if (error) {
    console.log(error);
    return null;
  }

  /* Get all movies and sort them alphabetically. 
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('title', { ascending: true });
   */

  status.ticket_count = count;
  status.revenue = data[0];

  return status
}

/* ------------------ Private functions ------------------ */

/**
  * Singleton pattern for retrieving Supabase Client connection
  */
function getSupabase() {
  if (!supabaseClient) {
    const supabaseUrl = 'https://krjjfaendpntpjocgdbl.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyampmYWVuZHBudHBqb2NnZGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDMwNDAsImV4cCI6MjA3NTQ3OTA0MH0.5YtJH_grLZRzapwH7aJEJ2yHUgCGEry28iMGuu_X1ls'
    supabaseClient = createClient(supabaseUrl, supabaseKey)
  }
  return supabaseClient;
}

/**
  * Reload on sign in or sign out
  */
function setupAuthlistener() {
  if (authSubscription) {
    authSubscription.data.subscription.unsubscribe();
  }

  // Reload the page when the user signs in or out
  const supabase = getSupabase();
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(event)
    if (/*event === "SIGNED_IN" || */event === "SIGNED_OUT") {
      window.location.reload();
    }
  });
}

/**
  * Convert movies from database form to object form
  */
function parseMovies(movies) {
// Convert every showtime to Date format and extract hours and minutes from runtime
  movies.forEach(m => {
    m.showtimes.forEach((v, i, a) => a[i] = new Date(v));
    let l = m.runtime.length;
    // Indexing assumes time recorded in no less than seconds, format 00:00:00
    let hours = m.runtime.substring(l-8, l-6);
    let minutes = m.runtime.substring(l-5, l-3);

    if (hours[0] === "0") {
      hours = hours[1];
    }

    if (minutes[0] === "0") {
      minutes = minutes[1];
    }
    m.runtime = hours + " hr " + minutes + " min";
  });
  return movies;
}

 // TODO: policy ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['Customer'::text, 'Admin'::text]))
