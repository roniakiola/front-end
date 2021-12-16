'use strict';

const url = 'http://localhost:3000';

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
// get user data for admin check
const user = JSON.parse(sessionStorage.getItem('user'));
const userID = user.id;

//Create link to user profile
const MyProfileNav = document.querySelector('#profileButton');

MyProfileNav.addEventListener('click', () => {
  location.href = 'profile.html?user=' + user.id;
});

const MyProfileBtn = document.querySelector('.profile-btn');

MyProfileBtn.addEventListener('click', () => {
  location.href = 'profile.html?user=' + user.id;
});

//fetch param from URL kategoria=?
const getIDParam = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
};

//Create profile page
const createProfile = () => {
  const profileContainer = document.getElementById('content');
  //   profileContainer.innerHTML = '';

  const profileDiv = document.createElement('div');
  profileDiv.classList.add('profileContainer');

  const image = document.createElement('img');
  image.src = url + '/thumbnails/' + user.img;
  //   image.alt = user.username;
  image.classList.add('profilePicture');
  const figure = document.createElement('figure').appendChild(image);
  if (user.img) {
    profileDiv.appendChild(figure);
  }

  const username = document.createElement('h2');
  username.innerHTML = user.username;

  const email = document.createElement('h2');
  email.innerHTML = user.email;

  const created = document.createElement('h2');
  created.innerHTML = user.created;

  profileDiv.appendChild(username);
  profileDiv.appendChild(email);
  profileDiv.appendChild(created);

  profileContainer.appendChild(profileDiv);
};
// createProfile();
const getProfile = async () => {
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/user/' + user.id, fetchOptions);
    const userInfo = await response.json();
    createProfile(userInfo);
  } catch (e) {
    console.log(e.message);
  }
};
getProfile();

// get id from address <a href="?user=1">Testi</a>
const categoryToken = getIDParam('user');

const createPostCards = (posts) => {
  // clear ul
  const threadContainer = document.getElementById('thread-container');
  threadContainer.innerHTML = '';

  posts.forEach((post) => {
    // create li with DOM methods
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    const img = document.createElement('img');
    img.src = url + '/thumbnails/' + post.img;
    img.alt = post.title;
    img.classList.add('resp');

    // open image in single.html
    img.addEventListener('click', () => {
      location.href = `?kategoria=${categoryToken}&post=${post.id}`;
    });

    const figure = document.createElement('figure').appendChild(img);
    imgContainer.appendChild(figure);

    const title = document.createElement('h2');
    title.classList.add('thread-title');
    title.innerHTML = post.title;

    const postedBy = document.createElement('p');
    postedBy.innerHTML = `Owner: ${post.ownername}`;

    const postCreated = document.createElement('p');
    postCreated.innerHTML = `Created: ${post.created}`;

    const postInfoContainer = document.createElement('div');
    postInfoContainer.classList.add('post-info-container');
    postInfoContainer.appendChild(postedBy);
    postInfoContainer.appendChild(postCreated);

    const textContent = document.createElement('p');
    textContent.innerHTML = post.content;

    const thread = document.createElement('div');
    thread.classList.add('thread');

    const threadLink = document.createElement('a');
    threadLink.setAttribute(
      'href',
      `home.html?kategoria=${post.category}&post=${post.id}`
    );
    threadLink.classList.add('thread-link');

    threadLink.appendChild(title);
    thread.appendChild(threadLink);
    thread.appendChild(postInfoContainer);
    thread.appendChild(imgContainer);
    thread.appendChild(textContent);
    threadContainer.appendChild(thread);

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
          const response = await fetch(url + '/post/' + post.id, fetchOptions);
          const json = await response.json();
          console.log('delete response', json);
          getPost();
        } catch (e) {
          console.log(e.message);
        }
      });

      thread.appendChild(modButton);
      thread.appendChild(delButton);
    }
  });
};

const getPost = async (id) => {
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/user/' + id, fetchOptions);
    const posts = await response.json();
    createPostCards(posts);
  } catch (e) {
    console.log(e.message);
  }
};
getPost(userID);