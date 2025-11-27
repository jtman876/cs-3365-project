import { getUser, login, register, logoutUser } from './auth.js'

// Get user details from auth.js
let user = await getUser();
let isAuthenticated = !(user === null);

// TODO: move to components/navbar.js and fix navbar elements shifting/flashing on load
// Build the Navigation background
let nav = document.querySelectorAll('nav')[0];
if (isAuthenticated) {
  let profile = document.createElement('a');
  profile.text = 'Profile';
  profile.href = './profile.html'
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
  })
  nav.appendChild(logout);
} else {
  let loginButton = document.createElement('a');
  loginButton.text = 'Log in';
  loginButton.href = './login.html'
  // TODO: remove later - temporarily login by hovering over
  loginButton.addEventListener("mouseover", async (event) => {
    await login("jtman876@gmail.com", "johndoe");
    window.location.reload();
  })
  nav.appendChild(loginButton);

  let register = document.createElement('a');
  register.text = 'Register';
  register.href = './register.html'
  nav.appendChild(register);
}

// TODO: make the body or container hidden until javascript is finished
 /*
const styleSheet = document.styleSheets[0];
// Set nav text to red, then  make the document visible
for (let i = 0; i < styleSheet.cssRules.length; i++) {
  const rule = styleSheet.cssRules[i];
  if (rule.selectorText === 'body') {
    rule.style.visibility = 'visible';
    break;
  }
}
*/

