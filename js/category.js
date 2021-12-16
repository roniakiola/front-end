'use strict';

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