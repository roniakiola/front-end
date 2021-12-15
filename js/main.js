'use strict';

const url = "http://localhost:3000";

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

//fetch param from URL kategoria=?
const getIDParam = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
};

// get id from address <a href="?kategoria=1">Testi</a>
const categoryToken = getIDParam("kategoria");
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
    threadLink.setAttribute('href', `?kategoria=${categoryToken}&post=${post.id}`);
    threadLink.classList.add('thread-link');

    threadLink.appendChild(title);
    thread.appendChild(threadLink);
    thread.appendChild(postInfoContainer);
    if (post.img) {
      thread.appendChild(imgContainer);
    };
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

      thread.appendChild(modButton);
      thread.appendChild(delButton);
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

  getReplies(categoryToken, postToken)


};

const categoryList = document.querySelector('#categories');

const createCategoryLinks = (categories) => {
  categoryList.innerHTML = '';

  categories.forEach((category) => {
    const sidebarCat = document.createElement('h3');
    sidebarCat.innerHTML = category.name;
    sidebarCat.classList.add('category-name');

    sidebarCat.addEventListener('click', () => {
      location.href = 'home.html?kategoria=' + category.id;
    });

    const catLink = document.createElement('a');
    catLink.classList.add('category-link');

    catLink.appendChild(sidebarCat);
    categoryList.appendChild(catLink);

    if (categoryToken == category.id) {
      const mainTitle = document.createElement('h1');
      mainTitle.innerHTML = category.name;

      const description = document.createElement('h2');
      description.innerHTML = category.description;

      const header = document.getElementById('content-header');
      header.appendChild(mainTitle);
      header.appendChild(description);
    }
  });
};

const getCategory = async () => {
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/category', fetchOptions);
    const categories = await response.json();
    createCategoryLinks(categories);
  } catch (e) {
    console.log(e.message);
  }
};
getCategory();
