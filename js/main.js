'use strict';

const collapseMenu = document.querySelector('#sidebar');
const content = document.querySelector('#content');

document.querySelector('#hamburgerMenu').addEventListener('click', () => {
  if(collapseMenu.classList.contains('hidden')){
    collapseMenu.classList.remove('hidden');
    content.classList.add('extra-margin');
  } else{
    collapseMenu.classList.add('hidden');
    content.classList.remove('extra-margin');
  }
});
