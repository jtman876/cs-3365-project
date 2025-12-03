import { login } from '../auth.js'

const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = form.elements['email'].value;
  const password = form.elements['password'].value;

  let isAuthenticated = await login(email, password);

  if (isAuthenticated) {
    window.location.replace('./index.html');
  } else {
    alert("Error logging in");
  }
});
