import { register } from './auth.js'

const form = document.querySelector('form');
form.addEventListener('submit', function(event) {
  // What does this do?
  event.preventDefault();

  const email = form.elements['email'].value;
  // TODO: get the rest of the form elements

  // let registered = register(email, /*...*/);
  let registered = true;

  if (registered) {
    window.location.replace('./index.html');

  } else {
    // TODO: Display error message
  }



})
