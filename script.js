const books = [];
const BOOK_EVENT = "custom-books";
const STORAGE_KEY = "storage-key";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

function generateId() {
  return +new Date();
}

const generateBookObject = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};

function addBook() {
  const id = generateId();
  const inputTitle = document.getElementById("inputBookTitle");
  const inputAuthor = document.getElementById("inputBookAuthor");
  const inputYear = document.getElementById("inputBookYear");
  const year = inputYear.value;
  const yearInput = parseInt(year);
  const checkIsCompleted = document.getElementById("inputBookIsComplete");

  const newBook = generateBookObject(
    id,
    inputTitle.value,
    inputAuthor.value,
    yearInput,
    checkIsCompleted.checked
  );
  books.push(newBook);
  console.log(books);
  saveToLocalStorage();
  document.dispatchEvent(new Event(BOOK_EVENT));

  inputTitle.value = "";
  inputAuthor.value = "";
  inputYear.value = "";
  checkIsCompleted.checked = false;
}

function saveToLocalStorage() {
  if (typeof Storage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } else {
    alert("Update your browser to enjoy this feature!");
  }
}

function loadStorage() {
  if (typeof Storage !== "undefined") {
    const dataBooks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (dataBooks !== null) {
      for (i of dataBooks) {
        books.push(i);
      }
    }
    document.dispatchEvent(new Event(BOOK_EVENT));
  } else {
    alert("Update your browser to enjoy this feature!");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadStorage();
});

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = `${bookObject.title}`;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Author : ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Year : ${bookObject.year}`;

  const buttonFinished = document.createElement("button");
  const buttonDelete = document.createElement("button");

  buttonDelete.className = "red";
  buttonDelete.innerText = "Delete";
  buttonDelete.addEventListener("click", function () {
    deleteBook(bookObject.id);
    document.dispatchEvent(new Event(BOOK_EVENT));
  });
  buttonFinished.className = "green";
  buttonFinished.addEventListener("click", function () {
    if (bookObject.isCompleted) {
      changeStatus(false)(bookObject.id);
    } else {
      changeStatus(true)(bookObject.id);
    }
    document.dispatchEvent(new Event(BOOK_EVENT));
  });

  if (bookObject.isCompleted) {
    buttonFinished.innerText = "Reread";
  } else {
    buttonFinished.innerText = "Finish";
  }

  const action = document.createElement("div");
  action.className = "action";
  action.append(buttonFinished, buttonDelete);

  const container = document.createElement("div");
  container.className = "container";
  container.append(textTitle, textAuthor, textYear, action);

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(container);

  buttonFinished.classList.add();
  buttonDelete.classList.add("mt-3", "p-1");

  return article;
}

function deleteBook(id) {
  const deleteData = books.find((item) => item.id === id);
  const confirmDeleteData = confirm(
    `Are you sure you want to delete the book ${deleteData.title}?`
  );
  if (confirmDeleteData) {
    const index = books.findIndex((item) => item.id === id);
    books.splice(index, 1);
    document.dispatchEvent(new Event(BOOK_EVENT));
    saveToLocalStorage();
    alert(
      `Book ${deleteData.title} Author ${deleteData.author} has been removed from the shelf`
    );
  }
}

function changeStatus(isCompleted) {
  return function (id) {
    for (let i = 0; i < books.length; i++) {
      if (books[i].id === id) {
        books[i].isCompleted = isCompleted;
      }
    }
    saveToLocalStorage();
    document.dispatchEvent(new Event(BOOK_EVENT));
  };
}

document.addEventListener(BOOK_EVENT, function () {
  const unread = document.getElementById("incompleteBookshelfList");
  unread.innerHTML = "";

  const complete = document.getElementById("completeBookshelfList");
  complete.innerHTML = "";

  for (const i of books) {
    const bookItem = makeBook(i);
    if (!i.isCompleted) {
      unread.append(bookItem);
    } else {
      complete.append(bookItem);
    }
  }
});
