import {getFetchPromise, user} from "./main.js";


 let token = "";
 if(localStorage.getItem("user")){
  token = JSON.parse(localStorage.getItem("user")).token // проверяет есть ли в локал сторедж что то , если да то парсит это в обьект и кидает в переменную токен.Таким образом при рефреше аторизация не слетает
 }

export const setToken = (newToken) => {
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
      return dataResponse.json()
    })
    .then(() =>{
      getFetchPromise()
    })
    .catch((error) => {
      
      console.log(error);
    });
}