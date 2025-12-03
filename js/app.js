<<<<<<< HEAD
import { getUser, login, register, logoutUser, Role } from './auth.js'
=======
import { Role, getUser, login, register, logoutUser } from './auth.js'
>>>>>>> 84b155adb4ae356221ea81a972d71a6f2f18443a

// Get user details from auth.js
let user = await getUser();
let isAuthenticated = !(user === null);

let nav = document.querySelectorAll('nav')[0];
if (isAuthenticated) {
<<<<<<< HEAD
  if (user.role == Role.ADMIN) {
=======
  if (user.role === Role.ADMIN) {
>>>>>>> 84b155adb4ae356221ea81a972d71a6f2f18443a
    let admin = document.createElement('a');
    admin.text = 'Admin';
    admin.href = './admin.html';
    nav.appendChild(admin);
  }

  let profile = document.createElement('a');
  profile.text = 'Profile';
  profile.href = './profile.html';
  nav.appendChild(profile);

  let logout = document.createElement('a');
  logout.text = 'Log out';
  logout.href = ''
  logout.addEventListener("click", (event) => {
    event.preventDefault();
    try {
      let error = logoutUser();
    } catch (err) {
      console.error("Error in logging out", err);
    }
  });
  nav.appendChild(logout);
} else {
  let loginButton = document.createElement('a');
  loginButton.text = 'Log in';
  loginButton.href = './login.html'
  nav.appendChild(loginButton);

  let register = document.createElement('a');
  register.text = 'Register';
  register.href = './register.html'
  nav.appendChild(register);
}
