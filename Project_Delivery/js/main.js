'use strict';

const cartButton = document.querySelector("#cart-button"); // получаю кнопу "Корзина"
const modal = document.querySelector(".modal"); // Получаю модальное окно
const close = document.querySelector(".close"); // Получаю кнопку закрытия модального окна
const buttonAuth = document.querySelector('.button-auth'); // Получаю кнопку входа
const modalAuth = document.querySelector('.modal-auth'); // Получаю модальное окно авторизации
const closeAuth = document.querySelector('.close-auth'); // Получаю кнопку закрытие модального окна авторизации
const logInForm = document.querySelector('#logInForm'); // Получаю форму авторизации в модальном окне авторизации
const logInInput = document.querySelector('#login'); // Получаю форму для ввода логина
const userName = document.querySelector('.user-name'); // Получаю форму, которая выводит логин авторизованного пользователя
const buttonOut = document.querySelector('.button-out'); // Получаю кнопку "Выйти"
const cardsRestaurants = document.querySelector('.cards-restaurants'); // Получаю блок с карточками ресторанов
const containerPromo = document.querySelector('.container-promo'); // Получаю блок с промо
const restaurants = document.querySelector('.restaurants'); // Получаю блок с ресторанами
const menu = document.querySelector('.menu'); // Получаю блок с меню
const logo = document.querySelector('.logo'); // Получаю лого в заголовке
const cardsMenu = document.querySelector('.cards-menu'); // Получаю блок с карточками меню
const restaurantTitle = document.querySelector('.restaurant-title'); // Получаю имя ресторана в шапке меню
const restautantRating = document.querySelector('.rating'); // Получаю рейтинг ресторана в шапке меню
const restaurantPrice = document.querySelector('.price'); // Получаю цену ресторана в шапке меню
const restaurantCategory = document.querySelector('.category'); // Получаю категорию ресторана в шапке меню
const inputSearh = document.querySelector('.input-search'); // Получаю поисковую строку блюд
const modalBody = document.querySelector('.modal-body'); // Получаю тело корзины, где находятся строки товаров
const modalPrice = document.querySelector('.modal-pricetag'); // Получаю поле с итоговой ценой товаров в корзине
const buttonClearCart = document.querySelector('.clear-cart'); // Получаю кнопку "Отмена" в корзине
let login = localStorage.getItem('userLogin'); // Переменная для размещения логина
const cartArray = JSON.parse(localStorage.getItem(`userCart_${login}`)) || []; // Создаю новый массив объектов-товаров корзины или получаю из локал-стора, если у данного пользователя уже есть корзина

function saveCart() { // Функция для сохранения корзины в локальном хранилище
  localStorage.setItem(`userCart_${login}`, JSON.stringify(cartArray)); // Выкладываю массив объектов-товаров корзины пользователя, приведённый в формат строки, в локальное хранилище браузера
}

function downloadCart() { // Функция подтягивания корзины из локального хранилища
  if (localStorage.getItem(`userCart_${login}`)) { // Проверяю, есть ли в локальном хранилище корзина данного пользователя
    const data = JSON.parse(localStorage.getItem(`userCart_${login}`));  // Достаю корзину и выполняю парсинг
    cartArray.push(...data); // При помощи spred оператора выполняю деструктуризацию массива data и поэлементный пуш в массив корзины
  }
}

const getData = async function(url) { // Асинхронная функция для запроса и получения данных от json
  const  response = await fetch(url); // Переменная для получения результата запроса
  if (!response.ok) { // Метод json для расшифровки данных
    throw new Error(`Ошибка по адресу ${url},
    статус ошибки ${response.status}!`); // Вызов ошибки (сброс выполнения функции)
  }
  return await response.json(); // Возвращаю данные (выполнение функции getData остановится в этой строке до тех пор, пока не выполнится метод json)
}

function toggleModal() { // функция навешивания класса is-open для отображения модального окна корзины
  modal.classList.toggle("is-open");
  if (modal.classList.contains("is-open")){ // Если окно корзины открыто, то отключить работу скроллера
    disableScroll();
  } else {
    enableScroll();
  }
  modal.addEventListener("click", function(event) { // Функция закрытия окна корзины, если кликнули вне этого окна
    if (event.target.classList.contains('is-open')){
      toggleModal();
    }
  });
}

function toggleModalAuth() { // функция навешивания класса is-open для отображения модального окна авторизации
  modalAuth.classList.toggle("is-open");
  if (modalAuth.classList.contains("is-open")){
    disableScroll();
  } else {
    enableScroll();
  }
}

function validName (str) { // Валидация логина с ограничением 2-20 символов, которыми могут быть буквы и цифры, первый символ обязательно буква
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/; 
  return regName.test(str);
}

function clearForm() { // Функция очистки формы авторизации
  logInInput.style.borderColor = '';
  logInForm.reset();
}

function returnMain() { // Функция возврата на страницу ресторанов, когда пользователь нажал на кнопку "Выйти" в процессе просмотра меню ресторана
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

function authorized() { // Функция, которая выполняется, когда пользователь авторизован 

  function logOut() { // Функция, диавторизующая пользователя
    login = ''; // Обнуляю логин пользователя
    cartArray.length = 0; // Обнуляю корзину пользователя при выходе
    buttonAuth.style.display = ''; // Добавляю кнопку "Войти", когда пользователь диавторизован
    userName.style.display = ''; // Выключаю отображение логина для диавторизованного пользователя
    buttonOut.style.display = ''; // Убираю кнопку "Выйти", когда пользователь диавторизован
    cartButton.style.display =''; // Убираю кнопку "Корзина", когда пользователь диавторизован
    buttonOut.removeEventListener("click", logOut); // Удаляю событие диавторизации
    localStorage.removeItem('userLogin'); // Удаляю логин пользователя из локального хранилища
    checkAuth(); // Вызываю функцию проверки авторизации
    returnMain(); // Вызываю функцию возврата на страницу ресторанов
  }

  userName.textContent = login; // Заношу логин пользователя в форму для отображения

  buttonAuth.style.display = 'none'; // Убираю кнопку "Войти", когда пользователь авторизован
  userName.style.display = 'inline'; // Включаю отображение логина авторизованного пользователя
  buttonOut.style.display = 'flex'; // Отображаю кнопку "Выйти", когда пользователь авторизован
  cartButton.style.display ='flex'; // Отображаю кнопку "Корзина", когда пользователь авторизован
  buttonOut.addEventListener("click", logOut); // Событие диавторизации

}

function notAuthorized() { // Функция, которая выполняется, когда пользователь неавторизован

  function logIn(event) { // Функция, авторизующая пользователя
    event.preventDefault(); // отмена стандартного поведения браузера (чтобы на submit страница не перезагружалась)
    if (validName(logInInput.value)){
      login = logInInput.value; // Получаю логин, введённый в форме авторизации
      localStorage.setItem('userLogin', login); // Выкладываю логин пользователя в локальное хранилище браузера
      toggleModalAuth(); // Закрываю модальное окно авторизации
      downloadCart(); // Вызываю функцию подтягивания корзины из локального хранилища
      buttonAuth.removeEventListener("click", toggleModalAuth); // Удаляю событие нажатия на кнопку "Войти"
      closeAuth.removeEventListener("click", toggleModalAuth); // Удаляю событие нажатия на кнопку закрытия модального окна авторизации
      logInForm.removeEventListener("submit", logIn); // Удаляю событие отправки данных формой авторизации в модальном окне
      logInForm.reset(); // Перезагружаю поле ввода Логина, чтобы там не хранились старые логины
      checkAuth(); // Вызываю функцию проверки авторизации
    } else {
      logInInput.style.borderColor = 'red';
      logInInput.value = '';
      
    }
  }

  buttonAuth.addEventListener("click", toggleModalAuth); // Событие нажатия на кнопку "Войти"
  closeAuth.addEventListener("click", toggleModalAuth); // Событие нажатия на кнопку закрытия модального окна авторизации
  logInForm.addEventListener("submit", logIn); // Событие отправки данных формой авторизации в модальном окне
  modalAuth.addEventListener("click", function(event) { // Функция закрытия окна авторизации, если кликнули вне этого окна
    if (event.target.classList.contains('is-open')){
      toggleModalAuth();
    }
  });
}

function checkAuth() { // Функция для проверки того, авторизован ли пользователь
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant(restaurant) { // Функция для генерации карточки ресторана

  const { image, kitchen, name, price, products, stars, time_of_delivery: timeOfDelivery } = restaurant; // Деструктуризация полученного объекта
  const cardRestaurant = document.createElement('a'); // Создаю ссылку с классами карточки и с свойством products
  cardRestaurant.className = 'card card-restaurant wow fadeInUp';
  cardRestaurant.setAttribute('data-wow-delay', '0.1s');
  cardRestaurant.products = products;
  cardRestaurant.info = {kitchen, name, price, stars}; // Добавляю объект info для динамического заголовка ресторана в меню
  // переменная, содержащая вёрстку карточки
  const card = `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  `;
  cardRestaurant.insertAdjacentHTML('beforeend',card); // добавление вёрстки карточки ресторана в оболочку-ссылку
  cardsRestaurants.insertAdjacentElement('beforeend',cardRestaurant); // добавление карточки ресторана на страницу
}

function createCardGood(goods) { // Функция создания карточки в меню ресторана
  const { description, id, image, name, price } = goods;
  const card = document.createElement('div');
  card.className = 'card wow fadeInUp';
  card.setAttribute('data-wow-delay', '0.1s');
  card.id = id;
  card.insertAdjacentHTML('beforeend', `
			<img src="${image}" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title card-title-reg">${name}</h3>
				</div>
				<div class="card-info">
					<div class="ingredients">${description}</div>
				</div>
				<div class="card-buttons">
					<button class="button button-primary button-add-cart">
					  <span class="button-card-text">В корзину</span>
					  <span class="button-cart-svg"></span>
				  </button>
				  <strong class="card-price card-price-bold">${price} ₽</strong>
			  </div>
			</div>
  `);
  cardsMenu.insertAdjacentElement('beforeend',card)
}

function openGoods(event) { // Функция создания меню конкретного ресторана
  const target = event.target; // Переменная, содержащая элемент, по которому кликнули
  if (login) {
    const restaurant = target.closest('.card-restaurant'); // Переменная, содержащая карточку, по элементу которой кликнули (closest осуществляет подъём по вышестоящим элементам, пока не найдёт элемент с нужным селектором)
    if (restaurant) { // Проверка, что кликнули именно по карточке (если мимо карточки, то будет NULL)
      cardsMenu.textContent = ''; // Очищаем меню
      containerPromo.classList.add('hide'); // Добавляю класс hide блоку с промо
      restaurants.classList.add('hide'); // Добавляю класс hide блоку с ресторанами
      menu.classList.remove('hide'); // Удаляю класс hide у блока с меню ресторана, на который кликнули
      const {name, kitchen, price, stars} = restaurant.info; // Деструктуризация полученного объекта (получаю от объекта карточки ресторана поля для того, чтобы в меню ресторана подставить в шапку)
      restaurantTitle.textContent = name; // Присваиваю элементам заголовка поля, принадлежащие объекту info объекта ресторана
      restautantRating.textContent = stars;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantCategory.textContent = kitchen;
      getData(`./db/${restaurant.products}`).then(function(data) { 
        data.forEach(createCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }
}

function addToCart(event) { // Функция добавления товара в корзину по нажатию на кнопку в карточке
  const target = event.target; // Получаю элемент, по которому кликнули
  const buttonAddToCart = target.closest('.button-add-cart'); // Получаю кнопку, внутри которой кликнули, если же кликнули вне кнопки, то получаю NULL
  if (buttonAddToCart) { // Проверяю, действительно ли нажали именно на кнопку
    const card = target.closest('.card'); // Получаю саму карточку товара, которой принадлежит кнопка, по которой кликнули
    const title = card.querySelector('.card-title-reg').textContent; // Получаю название товара данной карточки
    const cost = card.querySelector('.card-price').textContent; // Получаю цену товара данной карточки
    const id = card.id; // Получаю id карточки (id товара)
    const food = cartArray.find(function(item) { // Проверяю, есть ли в массиве корзины тот элемент, который я сейчас добавляю, если да, то он передаётся в food, а иначе NULL
      return item.id === id;
    })
    if (food) { // Если товар уже был в корзине, то просто увеличиваю его количество
      food.count += 1;
    } else {
      cartArray.push({ // Добавляю в массив корзины объект товара
        id: id,
        title: title,
        cost: cost,
        count: 1
      });     
    }
    saveCart(); // Вызываю функцию сохранения корзины в локальном хранилище
  }
}

function renderCart() { // Функция рендеринга корзины
  modalBody.textContent = ''; // Очищаю корзину, чтобы заново собрать
  cartArray.forEach(function({ id, title, cost, count }) { // Перебираю товары-объекты в массиве корзины, создаю вёрстку строки товара и вставляю её в тело корзины
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
      </div>
    `;
    modalBody.insertAdjacentHTML('beforeend', itemCart);
  });
  const totalPrice = cartArray.reduce(function(result, item){ // Считаю итоговую стоимость товаров в корзине
    return result + (parseFloat(item.cost))*item.count; // ParseFloat обрабатывает строку так, что до первой не цифры будет воспринимать символы, как число
  }, 0);
  modalPrice.textContent = totalPrice + ' ₽'; // Вывожу итоговую стоимость товаров в корзине
  saveCart(); // Вызываю функцию сохранения корзины в локальном хранилище для обновления информации
}

function changeCount(event) { // Функция изменения количества товара при помощи кнопок
  const target = event.target; // Получаю элемент, по которому кликнули
  if (target.classList.contains('counter-minus')){ // Если кликнули по кнопке минус
    const food = cartArray.find(function(item) { // Ищу в массиве корзины такой товар, id которого совпадает с id кнопки
      return item.id === target.dataset.id;
    });
    food.count--; // Уменьшаю число товара
    if (food.count === 0) {
      cartArray.splice(cartArray.indexOf(food), 1); // Если количество товара 0, то удаляю из корзины
    }
    renderCart(); // Перегружаю корзину
  }
  if (target.classList.contains('counter-plus')){ // Если кликнули по кнопке плюс
    const food = cartArray.find(function(item) { // Ищу в массиве корзины такой товар, id которого совпадает с id кнопки
      return item.id === target.dataset.id;
    });
    food.count++; // Увеличиваю число товара
    renderCart(); // Перегружаю корзину
  }
}

function init() { // Функция инициализации
  getData('./db/partners.json').then(function(data) { // Обработка полученного промиса
    data.forEach(createCardRestaurant);
  });
  buttonAuth.addEventListener("click", clearForm); // Событие нажатия на кнопку "Войти"
  cartButton.addEventListener("click", function() { // Событие нажатия на кнопку "Корзина"
    renderCart();
    toggleModal();
  });
  buttonClearCart.addEventListener("click", function() { // Событие клика по кнопке "отмена" в корзине
    cartArray.length = 0; // Очищаю массив посредством обнуления его длины
    renderCart(); // Перерендериваю корзину
    toggleModal(); // Закрываю модальное окно корзины
  });
  modalBody.addEventListener("click", changeCount); // Событие клика в любой точке тела корзины
  cardsMenu.addEventListener("click", addToCart); // Событие клика в любой точке меню любого ресторана
  close.addEventListener("click", toggleModal); // Событие нажатие на кнопку закрытия модального окна
  inputSearh.addEventListener("keypress", function(event) { // Событие нажатия клавиши Enter при вводе блюда в поиск
    if (event.charCode === 13) {
      const value = event.target.value.trim(); // Получаю значение таргета переданного события (то есть то, что ввели в поисковую строку)
      if (!value){ // Если пустой ввод
        event.target.style = 'outline-color: red';
        event.target.value = '';
        setTimeout(function() {
          event.target.style = '';
        }, 1500);
        return;
      }
      getData('./db/partners.json').then(function(data) { // Получаю все рестораны в формате json и обрабатываю данные
        const linksProduct = data.map(function(partner) { // Создаю массив из линков на json'ы всех ресторанов
          return partner.products;
        });
        return linksProduct;
      }).then(function(linksProduct) { // Перебираю массив из линков
        cardsMenu.textContent = ''; // Очищаем меню
        linksProduct.forEach(function(link) {
          getData(`./db/${link}`).then(function(goods) { // Получаю товары ресторана link
            const resultSearch = goods.filter(function(item) { // Переменная с фильтрованными товарами
              const name = item.name.toLowerCase();
              return name.includes(value.toLowerCase()); // Возвращаю только те товары, которые соответствуют поиску
            });
            containerPromo.classList.add('hide'); // Добавляю класс hide блоку с промо
            restaurants.classList.add('hide'); // Добавляю класс hide блоку с ресторанами
            menu.classList.remove('hide'); // Удаляю класс hide у блока с меню ресторана, на который кликнули
            restaurantTitle.textContent = 'Результаты поиска'; // Задаю новую шапку меню
            restautantRating.textContent = '';
            restaurantPrice.textContent = '';
            restaurantPrice.classList.add('hide');
            restaurantCategory.textContent = '';
            resultSearch.forEach(createCardGood); // Для каждого товара ресторана link генерю карточку
            event.target.value = ''; // Очищаю строку ввода
          });
        })
      });
    }
  });
  cardsRestaurants.addEventListener('click', openGoods); // Событие, когда кликнули в блоке с карточками
  logo.addEventListener('click', function(){
    containerPromo.classList.remove('hide'); // Удаляю класс hide у блока с промо
    restaurants.classList.remove('hide'); // Удаляю класс hide у блока с ресторанами
    menu.classList.add('hide'); // Добавляю класс hide блоку с меню ресторана, на который кликнули
    restaurantPrice.classList.remove('hide');
  })

  checkAuth(); // Первичный вызов функции проверки авторизации (при заходе на сайт)
}

init();
if (window.innerWidth<=480) {
  new Swiper('.swiper-container', { // Объект слайдера 
    slidesPerView: 1, // Показывать один слайд за раз
    loop: true, // Зациклить слайды
    autoplay: { // Автовоспроизведение слайдера
      delay: 5000,
      disableOnInteraction: false, // Автовоспроизведение не будет отключено после взаимодействия с пользователем
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  })
} else{
  new Swiper('.swiper-container', { // Объект слайдера 
    slidesPerView: 1, // Показывать один слайд за раз
    loop: true, // Зациклить слайды
    autoplay: { // Автовоспроизведение слайдера
      delay: 5000,
      disableOnInteraction: false, // Автовоспроизведение не будет отключено после взаимодействия с пользователем
    },
    effect: 'cube',
    cubeEffect: {
      shadow: false,
      slideShadows: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  })
}