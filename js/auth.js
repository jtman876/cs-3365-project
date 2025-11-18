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

/*const supabase = getSupabase()
supabase.auth.onAuthStateChange((event, session) => {
  console.log("auth changed:", event, session);
});
const { data: { session }} = await supabase.auth.getSession();
const user = await getUser();
console.log('session: ' + JSON.stringify(user, null, 2))

*/

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
          name: name,
          address: address,
          phone: phone,
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

  console.log('User found')
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.user_metadata.name,
    address: session.user.user_metadata.address,
    phone: session.user.user_metadata.phone
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

let authSubscription;

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


