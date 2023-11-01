import { setToken } from "./api.js";  // функция проверяет если ли в ЛС ключ user(в виде сроки) если да то парсит его в обьект и  ложит его в перемнную user . тем самым подтверждая что мы зарегистрированные


 
// функция отправляет ПОСТ запрос на сервер , в теле запроса мы стрингуем данные из поля login/password а чтобы вытащить эту строку с сервера мы должны их распрасить в обьект
export function getAuthorization({login, password}) {
  return fetch("https://wedev-api.sky.pro/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if(response.status === 400){
      throw new Error("Такой логин и пароль  не существует")
    }
    if(response.status === 500){
      throw new Error("Сервер упал");
    }
    return response.json();
  })
  .then((response) => {
    // в даннном then мы при входе устанавливаем в ЛС  через setItem ключ user и стрингуем респонс у котрого есть ключ user который содержит в себе все данные (id  имя пароль токен и тд)
    console.log(response);
    localStorage.setItem("user",  JSON.stringify(
      response.user))
      setToken(response.user.token); // вызываем функцию setToken(из main.js) которая принимает параметр newToken и в этот
      // newToken переходит обьект response у которого есть ключ user а у user есть ключ token и ложит этот токен в переменную токен
  })
  .catch((error) =>{
    if(error.message === "Такой логин и пароль  не существует"){
      alert("Такого пользователя нет")
      return;
    }
    if(error.message === "Сервер упал"){
      alert("Что-то с сервером");
      return;
    }
      alert("Неполадки с соединенем");
  })
}


