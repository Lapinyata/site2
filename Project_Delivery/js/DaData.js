$(document).ready(function () { // Проверка документа на готовность
  $("").suggestions({ // Получаю поле ввода адреса и для него выполняю функцию
      token: "b98ac454942373c06cbb69f490e0ce1050b9951e",
      type: "ADDRESS",
      onSelect: function(suggestion) { /* Событие вызывается, когда пользователь выбирает одну из подсказок */
          console.log(suggestion);
      }
  });
});