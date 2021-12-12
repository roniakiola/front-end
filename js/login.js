'use strict';
//testinä vanha back-end
const url = 'http://10.114.34.26/app';

//Adding event listeners to forms after html has loaded
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login-form');
  const registerForm = document.querySelector('#register-form')

  document.querySelector('#create-account-btn').addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  });

  document.querySelector('#create-account-btn-cancel').addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = serializeJson(loginForm);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  
    const response = await fetch(url + '/auth/login', fetchOptions);
    const json = await response.json();
    console.log('login response', json);
    if (!json.user) {
      alert(json.message);
    } else {
      // save token
      sessionStorage.setItem('token', json.token);
      sessionStorage.setItem('user', JSON.stringify(json.user));
      location.href = 'home.html';
    }
  });
  
  // submit register form
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let pass1 = document.getElementById('pass1').value;
    let pass2 = document.getElementById('pass2').value;
    if(pass1 !== pass2) {
      alert('Passwords did not match');
    } else {
      const data = serializeJson(registerForm);
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(url + '/auth/register', fetchOptions);
      const json = await response.json();
      alert(json.message);
    }
  });
  
});

