import { register } from '../auth.js'

const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = form.elements['name'].value;
  const email = form.elements['email'].value;
  const address = form.elements['address'].value;
  const phone = form.elements['phone'].value;
  const password = form.elements['password'].value;

  let registered = await register(name, email, address, phone, password);

  if (registered) {
    window.location.replace('./index.html');
  } else {
    alert('Error during registration');
  }
});
