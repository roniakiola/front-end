"use strict";
// const url = 'http://10.114.34.26/app'; // change url when uploading to server

// get query parameter
const getQParam = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
};

// get id from address <a href="?kategoria=1">Testi</a>
const categoryId = getQParam("kategoria");

// select existing html elements
const addForm = document.querySelector("#postForm");
const kategoria = document.querySelector("#kategoria");
kategoria.value = categoryId;

// submit add post form
addForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addForm);
  const fetchOptions = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: fd,
  };
  const response = await fetch(url + "/post", fetchOptions);
  const json = await response.json();
  alert(json.message);
  location.href = "home.html";
});

