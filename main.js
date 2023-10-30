import { getComments, postComment, deleteComments, toggleLike } from "./api.js"; 
import { sanitazeHtml } from "./sanitazeHtml.js";
import { renderListOfComments } from "./renderElements.js";
import { format } from "date-fns";



export const container = document.querySelector(".container"); 
// Выборка дива с классом container  чеерез DOM в него ложится та или иная часть разметки  в зависомости от условия 


let isLoader = true; // влияет на отрисовку лоадера или списка комментариев //
// export let loadingText = true;
export let user;  // Данная переменая указывает на то какое условие(какая разметка будет отображаться) выполняется// 



// Наш массив куда ложится список комментариев//
  let listOfObject = [];



// Функция котрая пытается определить есть ли в переменной User данные из LocalStorage.Если да то это True и значит происходит одна логика если false другая логика
export  function setAuth(){
  if(localStorage.getItem("user")){
     user = JSON.parse(localStorage.getItem("user"))
  }
  else{
     user = null;
  }
}

setAuth()

// export function setAuth() {
  
//   try {
//     user =  JSON.parse(localStorage.getItem("user"));
//   } catch  {
//      user =  undefined;
//   }
// }
// setAuth()


 // Функция которая срабатыввает при клике на кнопку выйти.LocalStorage.removeItem() означает что мы удаляем из локального хранилища 
 //данные о пользователе и переприсваиваем в переменную user null(тое сть пустое значение) , тем самым говорим что что мы вышли из учетки и нужно заново входить
export function logOut() {
  localStorage.removeItem("user");
  user = null;
}


//Сама функция renderElements которая отрисовывет массив обьетов listOfObject  в разметку HTML //

  export function renderElements() {
  if (!listOfObject) {
    return;
  }
  renderListOfComments(listOfObject);

  likeButtons();
  changeComments();
  deleteComments();
}
renderElements();

function showLoader() {
  if (isLoader) {
    container.innerHTML = `<p>Список комментариев загружается</p>`;
  }
}

showLoader();

export function getFetchPromise() {
  getComments() // вызываем функцию посылающую get запрос на сервер для получения списка комментов 
    .then((dataResponse) => {
      const newList = dataResponse.comments.map((element) => { // тут мы в переменную newList ложим наш обьект котрый пришел в 
        return {                                               //dataResponse и перекодируем его в нужные нам обьект  используя метод map().Так как обьект comments приходит с сервера немного в с другими данными мы в нем исправляем данные на нужные нам данные    
          name: sanitazeHtml(element.author.name),
          data: format(new Date(element.date), 'yyyy-MM-dd hh.mm.ss'),
          comment: sanitazeHtml(element.text),
          like: element.likes,
          isLiked: element.isLiked,
          id: element.id,
        };
      });
      listOfObject = newList;  // ложим новый обьект с нужными нам данными в перемнную listOfObject, котрорая явлеяется массив обьектов (обьявлена в main.js)
      renderElements();
      isLoader = false;
    })
    .catch((error) => {
      if (error.message === "Что то с сервером") {
        alert("Сервер сломался попробуй позже");
      }
      console.log(error);
    });
}
getFetchPromise();

// Добавляем новый комментарий используя метод POST //

export function addComment(button, addName, addText) {
  button.addEventListener("click", () => {
    button.disabled = true;
    button.textContent = "Добавляю"
    addText.classList.remove("error");
    addName.classList.remove("error");
    postComment(addText, addName, button);
  });
}

//Функция для проставки лайка //

function likeButtons() {
  let likeButtons = document.querySelectorAll(".like-button");
  for (let likeButton of likeButtons) {
    likeButton.addEventListener("click", (event) => {
      if(!user){
        alert("Нужно зарегистрироваться");
       return;
      }
      let id = likeButton.dataset.id;
      event.stopPropagation();
      toggleLike(id)
    });
  }
}

//Функция редактирования комментария

function changeComments() {
  let changeButtons = document.querySelectorAll(".change-comment-button");
  const addText = document.querySelector(".add-form-text");
  for (let changeButton of changeButtons) {
    changeButton.addEventListener("click", (event) => {
      if(!user){
        alert("Нужно зарегистрироваться");
       return;
      }
      event.stopPropagation();
      let index = changeButton.closest(".comment").dataset.index;
      let comment = listOfObject[index];
      if (comment.isEdit) {
        comment.isEdit = false;
        comment.comment = addText.value;
        comment.data = new Date().toLocaleString().replace(",", "");
      } else {
        comment.isEdit = true;
      }
      renderElements();
    });
  }
}

// Функция ответа на комментарий //
  export function answerOnCommnets(addText) {
  let commentElements = document.querySelectorAll(".comment-text");
  for (let commentElement of commentElements) {
    commentElement.addEventListener("click", () => {
      if(!user){
        alert("Нужно зарегистрироваться");
       return;
      }
      let index = commentElement.closest(".comment").dataset.index;
      let comment = listOfObject[index];
      addText.value = `${comment.comment} ${comment.name}`;
    });
  }
}

 
