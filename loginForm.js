import { container, getFetchPromise, setAuth} from "./main.js";
import { getAuthorization } from "./getAuthorization.js";
import { getRegistr } from "./getRegistr.js";
import { capitalize } from "lodash";

let isMode = true; // Данный флаг(переключатель) указывает на то что будет отрисованно.Либо форма регистрации либо форма входа

 

export function renderFormLogin() {
  

  const loginForm = `<div class="add-form" id="formUser">
    <h1>${isMode ? "Вход" : "Регистрация"}</h1>
    <div class="input-block"> 
    ${isMode ? "" : `<input type="text" id="nameUser" class="add-form-name" placeholder="Введите ваше имя" />`}
    <input type="text" id="login" class="add-form-name" placeholder="Введите ваш логин" />
    <input type="password" id="password" class="add-form-text" placeholder="Введите ваш пароль" rows="4"/>
    </div>
    <div class="add-form-row">
      <button id="button-login" class="add-form-button">${isMode ? "Вход" : "Зарегистрироваться"}</button>
      <button id="button-reg" class="add-form-button">${isMode ? "Регистрация" : "К форме входа"}</button>
    </div>
  </div>`;

  container.innerHTML = loginForm; // ложим в container только нашу форму входа/ регистрации


  let buttonReg = document.getElementById("button-reg");
  buttonReg.addEventListener("click", () => {
    isMode = !isMode;  // при клике на кнопку зарегистрироваться/ к форме входа у нас идет переключение флага isMode на противоположеный(true становится false или на оборот)
    renderFormLogin()  // повтроно вызываем функции отрисовки формы входа/ регистрации иначе не будет отоьражться переключение между формами
  })

  const buttonLogin = document.getElementById("button-login");

  if(isMode){
    // IsMode если тру то при клике на кнопку вход срабатывает функция getAuthorization которая отвечает за вход 
    buttonLogin.addEventListener("click", () => {
      const loginValue = document.getElementById("login");
      const passwordValue = document.getElementById("password");
      container.textContent = "Подождите, идет загрузка приложения";
      getAuthorization({
        login: loginValue.value,
        password: passwordValue.value,
      })
      .then(() => {
        // в этом then после того как отработала функция  getAuthorization у нас в перемннную токен ложится newToken
        // за это отвечает функция SetToken и отрабатвает потом функция getFetchPromise получающая актуальный список постов с сервера
        // и рендерящая их на странице
        setAuth();
        getFetchPromise();
      })
    });
  }else{
    // Если isMode false то при клике на кнопку К форме входа отрабатывает обработчик ( обработчик на кнопке Зарегаться, К форме входа)
    // имеет один и тот же обработчик , он просто переходит с кнопки на кнопку 
    buttonLogin.addEventListener("click", () =>{
      const reg = document.getElementById("nameUser");
      const loginValue = document.getElementById("login");
      const passwordValue = document.getElementById("password");
      container.textContent = "Подождите, идет загрузка приложения";
      getRegistr({
        login: loginValue.value,
        name: capitalize(reg.value),
        password: passwordValue.value,
      })
      .then(() =>{
        setAuth();
        getFetchPromise();
      })
    })
  }
  

}