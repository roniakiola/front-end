'use strict';

const collapseMenu = document.querySelector('#sidebar');
const content = document.querySelector('#content');

document.querySelector('#hamburgerMenu').addEventListener('click', () => {
  if (collapseMenu.classList.contains('hidden')) {
    collapseMenu.classList.remove('hidden');
    content.classList.add('extra-margin');
  } else {
    collapseMenu.classList.add('hidden');
    content.classList.remove('extra-margin');
  }
});

// select existing html elements
const ul = document.querySelector('#list');

// get user data for admin check
const user = JSON.parse(sessionStorage.getItem('user'));

// create post cards
const createPostCards = (posts) => {

  // clear ul
  ul.innerHTML = '';
  posts.forEach((post) => {
    // create li with DOM methods
    const img = document.createElement('img');
    img.src = url + '/thumbnails/' + post.img;
    img.alt = post.title;
    img.classList.add('resp');

    // open image in single.html
    img.addEventListener('click', () => {
      location.href = 'single.html?id=' + post.id;
    });

    const figure = document.createElement('figure').appendChild(img);

    const h2 = document.createElement('h2');
    h2.innerHTML = post.title;

    const p1 = document.createElement('p');
    p1.innerHTML = `Created: ${post.created}`;

    const p2 = document.createElement('p');
    p2.innerHTML = post.content;

    const p3 = document.createElement('p');
    p3.innerHTML = `Owner: ${post.owner}`;

    const li = document.createElement('li');
    li.classList.add('light-border');

    li.appendChild(h2);
    li.appendChild(figure);
    li.appendChild(p1);
    li.appendChild(p2);
    li.appendChild(p3);
    ul.appendChild(li);
    if (user.role === 1 || user.id === post.owner) {
      // link to modify form
      const modButton = document.createElement('a');
      modButton.innerHTML = 'Modify';
      modButton.href = `modify-post.html?id=${post.id}`;
      modButton.classList.add('button');

      // delete selected post
      const delButton = document.createElement('button');
      delButton.innerHTML = 'Delete';
      delButton.classList.add('button');
      delButton.addEventListener('click', async () => {
        const fetchOptions = {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        };
        try {
          const response = await fetch(
            url + '/post/' + post.id,
            fetchOptions
          );
          const json = await response.json();
          console.log('delete response', json);
          getPost();
        } catch (e) {
          console.log(e.message);
        }
      });

      li.appendChild(modButton);
      li.appendChild(delButton);
    }
  });
};

// AJAX call
const getPost = async () => {
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const url = "http://localhost:3000";
    const response = await fetch(url + '/post', fetchOptions);
    const posts = await response.json();
    createPostCards(posts);
  } catch (e) {
    console.log(e.message);
  }
};
getPost();