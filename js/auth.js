import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

/**
 * @file Helper functions for accessing Supabase.
 * Typically, you should first check if the user is logged in with getUser
 * Then, you can add or remove objects from the database with these functions
 */

export const Theaters = Object.freeze({
  LUBBOCK: 'Lubbock',
  AMARILLO: 'Amarillo',
  LEVELLAND: 'Levelland',
  PLAINVIEW: 'Plainview',
  SNYDER: 'Snyder',
  ABILENE: 'Abilene'
});

export const Roles = Object.freeze({
  CUSTOMER: 'Customer',
  ADMIN: 'Admin'
});

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
  runtime: "1 hour 28 minutes 56 seconds",
  showtimes: [
    new Date(),
  ]
}

// TODO: Remove later - testing movie retrieval from Supabase
// let supabase = getSupabase();
// login("jtman876@gmail.com", "johndoe");
let user = await getUser();
if (user) {
  let movies = await getCurrentMovies();
  console.log(user);
  console.log(movies);
}

/**
 * Takes email and password and attempts to authenticate them with Supabase
 */
export async function login(email, password) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
  console.log(data)
  console.log(error)
  setupAuthlistener();
  return null;
}

/**
 * Register a user with Supabase.
 * @returns {boolean} If the registration was successful
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
  console.log(error)
  return !(error === null);
}

/**
 * Returns a User object with personal information, or null if there is no user logged in
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
 * Signs out the user
 */
export async function logoutUser() {
  const supabase = getSupabase()
  const { error } = await supabase.auth.signOut()
  console.log(error)
  return error
}

export async function updateProfile() {
  return null;
}

/**
 * Takes a User object and attempts to retrieve order history
 * Returns a list of tickets
 */
export async function getOrderHistory(user) {
  return null;
}

/**
 * Gets the current movies from the database and returns a list of movie objects
 */
export async function getCurrentMovies() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('movies')
    .select('*')  
    .eq('is_current', true)

  if (error) {
    console.error('Error fetching current movies:', error)
    return null;
  }

  return data
}

export async function getUpcomingMovies() {
  return null;
}

export async function searchMovies(title) {
  return null;
}

/**
 * Choose information for the ticket. Returns unique barcode upon successful delivery
 * No need to send payment information to the database - it is automatically accepted
 * @Returns {number} barcode - the unique barcode for the ticket ordered
 */
export async function orderTicket(movie, time, theater, numSeats) {
  return null;
}

export async function submitReview(review) {
  return null;
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

export async function updateMovie(movie) {
  return null;
}

export async function removeMovie(movie) {
  return null;
}

export async function getStatus() {
  return null;
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
    if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
      window.location.reload();
    }
  });
}

 // TODO: policy ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['Customer'::text, 'Admin'::text]))
