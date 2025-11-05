import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const Theaters = Object.freeze({
  LUBBOCK: 'Lubbock',
  AMARILLO: 'Amarillo',
  LEVELLAND: 'Levelland',
  PLAINVIEW: 'Plainview',
  SNYDER: 'Snyder',
  ABILENE: 'Abilene'
}) 

let supabaseClient;




/**
 * Takes email and password and attempts to authenticate them with Supabase
 */
export async function login(email, password) {

}

/**
 * Register a user with Supabase.
 * @returns {boolean} If the registration was successful
 */
export async function register(name, email, address, phone, password) {
  supabase = getSupabase();
  const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
          address: address,
          phone: phone,
        }
      }
    }
  )
  return !(error === null);
}

/**
 * Returns a User object with personal information, or null if there is no user logged in
 */
export async function getUser() {
  return null;
}

export async function updateProfile() {
  return null;
}

/**/

/**
 * Takes a User object and attempts to retrieve order history
 * Returns a list of tickets
 */
export async function getOrderHistory(user) {
  return null;
}

export async function getCurrentMovies() {
  return null;
}

export async function getUpcomingMovies() {
  return null;
}

export async function searchMovies(title) {
  return null;
}

// Choose information for the ticket. Returns unique barcode upon successful delivery
// No need to send payment information to the database - it is automatically accepted
/**
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
  return null;
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

function createMovie(id, title, synopsis, reviews, cast,) {

}
