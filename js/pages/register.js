import { register, logoutUser } from '../auth.js'

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
    logoutUser();
    alert('Please log in with the account you just created to access the system.')
  } else {
    alert('Error during registration');
  }
});
