'use strict';

const url = 'http://10.114.34.26/app2';

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

// get id from address <a href="?kategoria=1">Testi</a>
const categoryToken = getIDParam('kategoria');
const postToken = getIDParam('post');

// create post cards
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
    if (!postToken) {
      img.addEventListener('click', () => {
        location.href = `?kategoria=${categoryToken}&post=${post.id}`;
      });
    } else {
      img.addEventListener('click', () => {
        if (img.src == url + '/thumbnails/' + post.img) {
          img.src = url + '/' + post.img;
        } else {
          img.src = url + '/thumbnails/' + post.img
        }
      });
    }

    const figure = document.createElement('figure').appendChild(img);
    imgContainer.appendChild(figure);

    const title = document.createElement('h2');
    title.classList.add('thread-title');
    title.innerHTML = post.title;

    const postedBy = document.createElement('p');
    postedBy.innerHTML = `Posted by user: ${post.ownername}`;

    const postCreated = document.createElement('p');
    postCreated.innerHTML = `Posted: ${post.created}`;

    const postInfoContainer = document.createElement('div');
    postInfoContainer.classList.add('post-info-container');
    postInfoContainer.appendChild(postedBy);
    postInfoContainer.appendChild(postCreated);

    const textContent = document.createElement('p');
    textContent.innerHTML = post.content;

    const threadMessage = document.createElement('div');
    threadMessage.classList.add('thread-message');
    threadMessage.appendChild(textContent);

    const thread = document.createElement('div');
    thread.classList.add('thread');

    const threadLink = document.createElement('a');
    threadLink.setAttribute('href', `?kategoria=${categoryToken}&post=${post.id}`);

    threadLink.classList.add('thread-link');

    threadLink.appendChild(title);
    if (post.title) {
      thread.appendChild(threadLink);
    };

    const postContent = document.createElement('div');
    postContent.classList.add('post-content');
    if (post.img) {
      postContent.appendChild(imgContainer);
    };
    postContent.appendChild(threadMessage);

    thread.appendChild(postInfoContainer);
    thread.appendChild(postContent);
    threadContainer.appendChild(thread);

    if (postToken) {
      threadContainer.removeAttribute('id', 'thread-container');
      threadContainer.setAttribute('id', 'reply-container');
    }

    if (user.role === 1 || user.id === post.owner) {
      // link to modify form
      const modButton = document.createElement('button');
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
        location.href = ' ';
      });

      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');

      buttonContainer.appendChild(modButton);
      buttonContainer.appendChild(delButton);

      thread.appendChild(buttonContainer);
    }
  });
};
if (!postToken) {
  const getPost = async (id) => {
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/post/' + id, fetchOptions);
      const posts = await response.json();
      createPostCards(posts);
    } catch (e) {
      console.log(e.message);
    }
  };

  getPost(categoryToken);

} else {

  const getReplies = async (id, postid) => {
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/post/' + id + '/' + postid, fetchOptions);

      const posts = await response.json();
      createPostCards(posts);
    } catch (e) {
      console.log(e.message);
    }
  };
  const removeFormTitle = document.querySelector('input[type=text]');
  removeFormTitle.removeAttribute('type');
  removeFormTitle.setAttribute('type', 'hidden');

  const addParentForm = document.querySelector('input[name=parent]');
  addParentForm.setAttribute('value', postToken);

  getReplies(categoryToken, postToken);
};
