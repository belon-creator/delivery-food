'use strict';

const cartButton = document.querySelector('#cart-button');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');

function toggleModal() {
  modal.classList.toggle('is-open');
}

// ==================================

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');

const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`error ${url}, mistake ${response.status}`);
  }
  return await response.json();
};

function toogleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  if (modalAuth.classList.contains('is-open')) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function authorized() {
  console.log('authorized');

  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
  }

  buttonAuth.style.display = 'none';
  userName.textContent = login;
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
  console.log('notAuthorized');

  function logIn(event) {
    event.preventDefault();

    if (loginInput.value.trim()) {
      login = loginInput.value;
      localStorage.setItem('gloDelivery', login);
      toogleModalAuth();

      buttonAuth.removeEventListener('click', toogleModalAuth);
      closeAuth.removeEventListener('click', toogleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = '#ff0000';
      loginInput.value = '';
    }
  }

  buttonAuth.addEventListener('click', toogleModalAuth);
  closeAuth.addEventListener('click', toogleModalAuth);
  logInForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', function (event) {
    if (event.target.classList.contains('is-open')) {
      toogleModalAuth();
    }
  });
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

checkAuth();

function createCardRestaurant(restaurant) {
  const {
    image,
    kitchen,
    name,
    price,
    products,
    stars,
    time_of_delivery,
  } = restaurant;

  const card = `
  <a class="card card-restaurant" data-products='${products}'>
  <img
    src=${image}
    alt="image"
    class="card-image"
  />
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title">${name}</h3>
      <span class="card-tag tag">${time_of_delivery}</span>
    </div>
   
    <div class="card-info">
      <div class="rating">${stars}</div>
      <div class="price">От ${price} uah</div>
      <div class="category">${kitchen}</div>
    </div>    
  </div>  
</a>

  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood(goods) {
  const { id, name, description, price, image } = goods;

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
  <img
  src="${image}"
  alt="image"
  class="card-image"
/>
<div class="card-text">
  <div class="card-heading">
    <h3 class="card-title card-title-reg">${name}</h3>
  </div>
  <!-- /.card-heading -->
  <div class="card-info">
    <div class="ingredients">
    ${description}
    </div>
  </div>
  <!-- /.card-info -->
  <div class="card-buttons">
    <button class="button button-primary button-add-cart">
      <span class="button-card-text">В корзину</span>
      <span class="button-cart-svg"></span>
    </button>
    <strong class="card-price-bold">${price} грн</strong>
  </div>
  `;
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest('.cards-restaurants');

  if (restaurant) {
    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');

    getData(`./db/${restaurant.dataset.products}`).then(function (data) {
      data.forEach(createCardGood);
    });
    menu.classList.remove('hide');
  }
}

logo.addEventListener('click', function () {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
});

function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);

    cartButton.addEventListener('click', toggleModal);
    close.addEventListener('click', toggleModal);

    cardsRestaurants.addEventListener('click', openGoods);
  });
}

init();
