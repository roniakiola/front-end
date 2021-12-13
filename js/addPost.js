'use strict';
const url = 'http://10.114.34.26/app'; // change url when uploading to server

// select existing html elements
const addForm = document.querySelector('#postForm');

// submit add cat form
addForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/post', fetchOptions);
  const json = await response.json();
  alert(json.message);
  location.href = 'home.html';
});