window.disableScroll = function () { // Функция отключения скроллинга
  const widthScroll = window.innerWidth - document.body.offsetWidth // Получаю ширину сролл ленты
  document.body.dataset.scrollY = window.scrollY; // Так как при стилях css, прописанных ниже, сайт будет прыгать в самый верх, то запоминаю положение, где был пользователь
  // задаю стили css для оключения скроллинга
  document.body.style.cssText = ` 
    position: fixed;
    top: ${-window.scrollY}px;
    left: 0;
    width: 100%;
    overflow: hidden;
    height: 100vh;
    padding-right: ${widthScroll}px;
  `;
}

window.enableScroll = function () { // Функция включения скроллинга
  document.body.style.cssText = ``; // обнуляю заданные стили css
  window.scroll({top: document.body.dataset.scrollY}) // так как страница улетает вверх, то возвращаю её в положение, где был пользователь
}
