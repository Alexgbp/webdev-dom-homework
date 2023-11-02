import { container, answerOnCommnets} from "./main.js";
import { addComment } from "./main.js";
import {  user} from "./main.js";


export function formForComments() {
  // Создаем переменную  appForm в которую ложим разметку формы добавления комментария 
  // на 12 строке идет проверка , если перемнная user имеет в себе что то то мы в инпуте  формы отлючаем иннпут(не активный)
  //имя пользователя если нет то ничего не делаем.То же самое с value инпута .Если user = true(что то есть) мы подставляем в инпут подставляем иям пользователя
  const appForm = `<div class="add-form" id="formUser">
  <div class="input-block">
  <input ${user ? "disabled" : ""} value="${user ? user.name : ""}" type="text" class="add-form-name" placeholder="Введите ваше имя" />
  <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea></div>
    <div class="add-form-row">
    <button class="add-form-button">Написать</button>
    </div>
  </div>`;
  container.innerHTML += appForm;  // Ложим в container(наше тело приложения) в нутрь  форму  appForm + то что уже  есть на странице(список постов)

  const button = document.querySelector(".add-form-button");  // выбираем кнопку инпут и техареа так как форма рендерится(динамическая) и нужно после отрисовки заново выбирать все эти поля + кнопка
  const addName = document.querySelector(".add-form-name");
  const addText = document.querySelector(".add-form-text");

  function validation() {
    if (!addName.value || !addText.value) {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  }
  addName.addEventListener("input", validation);
  addText.addEventListener("input", validation);

  

  addComment(button, addName, addText);

  answerOnCommnets(addText);
}
