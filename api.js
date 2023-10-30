import {getFetchPromise, user} from "./main.js"; 


 let token = ""; // в данной переменной у нас будет  харниться токен пользователя 

 // Проверка : Токен записался в ЛС , но при рефреше он не исчезает из ЛС но при каких либо действияих мы полусаем Не Авторизован .Так вот , если в ЛокалСторедж есть пользователь (авторизован) то мы в перемнную token ложим обьект и его ключ (.token) и парсим  его в JSON.Таким образом при рефреше аторизация не слетает
 if(localStorage.getItem("user")){
  token = JSON.parse(localStorage.getItem("user")).token
 }

export const setToken = (newToken) => {     // в переменную newToken у нас ложится обьект котрый приходит в респонс при регистрации или авторизации.Из этого респонсе берем название обьекта user.token ( тое сть у обьекта user берем ключ токен и этот токен ложим в перемнную newToken котрую в свою очередь записываем в перемнную token вктри фуркции setToken)
  token = newToken
};

export function getComments() {
  return fetch("https://wedev-api.sky.pro/api/v2/alexander-potapov/comments", {
    method: "GET",
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  .then((response) => {
    if (response.status === 500) {
      throw new Error("Что то с сервером");
    } else {
      return response.json();
    }
  });
}

 export function postComment(firstValue, secondValue, button) {
    return fetch(
      "https://wedev-api.sky.pro/api/v2/alexander-potapov/comments",
      {
        method: "POST",
        body: JSON.stringify({
          text: firstValue.value,
          name: secondValue.value,
          forceError: true,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 400) {
          firstValue.classList.add("error");
          secondValue.classList.add("error");
          throw new Error("Короткое имя");
        } else if (response.status === 500) {
          throw new Error("Что то с сервером");
        } else if (response.status === "Ошибка сервера") {
          throw new Error("Failed to fetch");
        }
      })
      .then((dataResponse) => {
        console.log(dataResponse);
        getFetchPromise();
        firstValue.value = "";
        secondValue.value = "";
        button.disabled = false;
        button.textContent = "Написать"
      })
      .catch((error) => {
        if (error.message === "Короткое имя") {
          alert("Имя и комментарий должны быть не короче 3 символов");
          button.disabled = false;
          button.textContent = "Написать"
        }
        if (error.message === "Что то с сервером") {
          alert("Сервер сломался попробуй позже");
          postComment(firstValue, secondValue);
        }
        if (error.message === "Failed to fetch") {
          alert("Кажется, у вас сломался интернет, попробуйте позже");
          button.disabled = false;
          button.textContent = "Написать"
        }
        console.log(error);
      });
}

export function deleteComments() {
  const deleteButtons = document.querySelectorAll(".delete-comment-button");
  for (let deleteButton of deleteButtons) {
   deleteButton.addEventListener("click", (event) => {
    if(!user){
      alert("Нужно зарегистрироваться");
     return;
    }
    event.stopPropagation();
    let id = deleteButton.dataset.id;
    return fetch("https://wedev-api.sky.pro/api/v2/alexander-potapov/comments/" + id,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((dataResponse) => {
        console.log(dataResponse);
        getFetchPromise();
      })
      .catch((error) => {
        console.log(error);
      });
   })
  }
}

// Функция котрая приклеивает эндпоинт к нашему URL , принимает на вход парметр id , принимает в теле запроса метод POST и заголовок 
// Authorization: `Bearer ${token}` который дает понять что мы авторизованны.Токен всегда начинается со слова Bearer( в код )в LS этого слова нет
export function toggleLike(id) {
  return fetch(`https://wedev-api.sky.pro/api/v2/alexander-potapov/comments/${id}/toggle-like`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((dataResponse) => {
      return dataResponse.json()  // респонсе включает всебя или true или false (лайк нажат или убран)
    })
    .then(() =>{
      getFetchPromise() // Функция получения списка комментотв с методом GET в теле запроса и с функцией Рендер разметки внутри себя, нужна что бы отрисовать лайк пользователю
    })
    .catch((error) => {
      console.log(error.message);
    });
}