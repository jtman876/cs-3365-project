const Theaters = Object.freeze({
  LUBBOCK: 'Lubbock',
  AMARILLO: 'Amarillo',
  LEVELLAND: 'Levelland',
  PLAINVIEW: 'Plainview',
  SNYDER: 'Snyder',
  ABILENE: 'Abilene'
}) 

function createMovie(id, title, synopsis, reviews, cast,) {
}


/**
 * Takes email and password and attempts to authenticate them with Supabase
 */
export async function login(email, password) {

}

/**
 *
 */
export async function register(name, email, address, phone, password) {

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
