import { login } from './auth.js'

const form = document.querySelector('form');
form.addEventListener('submit', function(event) {
  // What does this do?
  event.preventDefault();

  const email = form.elements['email'].value;
  // TODO: get the rest of the form elements

  // let isAuthenticated = login(email, /*...*/);
  let isAuthenticated = true; // replace this line

  if (isAuthenticated) {
    window.location.replace('./index.html');

  } else {
    // TODO: Display error message
  }



})
