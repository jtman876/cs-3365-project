import { getUser, updateProfile } from '../auth.js'

let inputs = [];
let nameInput = document.getElementsByName('name')[0];
inputs.push(nameInput);
let emailInput = document.getElementsByName('email')[0];
inputs.push(emailInput);
let addressInput = document.getElementsByName('address')[0];
inputs.push(addressInput);
let phoneInput = document.getElementsByName('phone')[0];
inputs.push(phoneInput);

let modifiable = document.getElementsByClassName("modifiable")[0];
let profileButton = document.querySelectorAll("button")[0];

await fillProfile();

let submitForm = document.querySelectorAll('input[type="submit"]')[0]

profileButton.addEventListener('click', function() {
  for (let input of inputs) {
    input.disabled = false;
  }
  submitForm.style.display = "block";
});

submitForm.addEventListener('click', async (event) => {
  event.preventDefault();
  
  for (let input of inputs) {
    input.disabled = true;
  }
  submitForm.style.display = "none";

  let response = await updateProfile(nameInput.value, emailInput.value, addressInput.value, phoneInput.value);
  await fillProfile(); 

  if (response) {
    createMessageAfter(submitForm, 'Success!', '#4CAF50');
  } else {
    createMessageAfter(submitForm, 'Error', 'red');
  } 
});

async function fillProfile() {
  let user = await getUser();
  if (!user) {
    modifiable.style.display = "none";
    const error = document.createElement('span');
    error.style.color = 'red';
    error.textContent = "Error: could not display profile since no user was found.";
    error.style.fontSize = '1rem';
    modifiable.parentNode.insertBefore(error, modifiable.nextSibling);
  }
  nameInput.value = user.name;
  emailInput.value = user.email;
  addressInput.value = user.address;
  phoneInput.value = user.phone;
}

function createMessageAfter(element, content, color) {
  const message = document.createElement('div');
  message.textContent = content;
  Object.assign(message.style, {
    width: '100px',
    height: '60px',
    backgroundColor: color, 
    borderRadius: '12px',
    color: 'white', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: '0',
    transition: 'opacity 1s ease-in', 
    fontSize: '1.2rem'
  });
  element.parentNode.appendChild(message);

  requestAnimationFrame(() => {
    message.style.opacity = '1';
  });

  setTimeout(() => {
    message.style.opacity = '0';
    message.addEventListener('transitionend', () => {
      message.remove();
    });
  }, 1500);
}

