import { getUser } from './auth.js'

// Get user details from auth.js
let user = await getUser();
let isAuthenticated = !(user === null);
let isAdmin = (isAuthenticated) ? user.admin : false;

// TODO: move to components/navbar.js and fix navbar elements shifting/flashing on load
// Build the Navigation background
let nav = document.querySelectorAll('nav')[0];
if (isAuthenticated) {
  let profile = document.createElement('a');
  profile.text = 'Profile';
  profile.href = './profile.html'
  nav.appendChild(profile);
} else {
  let login = document.createElement('a');
  login.text = 'Log in';
  login.href = './login.html'
  nav.appendChild(login);

  let register = document.createElement('a');
  register.text = 'Register';
  register.href = './register.html'
  nav.appendChild(register);
}

// Hover over links
let links = document.querySelectorAll('section')[0].children;
for (const link of links) {
  link.addEventListener("mouseover", (event) => {
    event.target.style.background = "lightblue";
    // event.target.style.fontSize = "1.8rem";
  })
  link.addEventListener("mouseout", (event) => {
    event.target.style.background = "white";
    // event.target.style.fontSize = "1.5rem";
  })
}
