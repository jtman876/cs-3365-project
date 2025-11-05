import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { getUser } from './auth.js'

const supabaseUrl = 'https://krjjfaendpntpjocgdbl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyampmYWVuZHBudHBqb2NnZGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDMwNDAsImV4cCI6MjA3NTQ3OTA0MH0.5YtJH_grLZRzapwH7aJEJ2yHUgCGEry28iMGuu_X1ls'
const supabase = createClient(supabaseUrl, supabaseKey)

// Get user details from auth.js
let user = await getUser();
let isAuthenticated = !(user === null);
let isAdmin = (isAuthenticated) ? user.admin : false;

// Build the Navigation Bar
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
