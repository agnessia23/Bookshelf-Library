const books = [];
const RENDER_EVENT = 'render-book';
const KEY_LOCAL = 'BOOK_APPS';
const SAVED_BOOK = "saved-book";


document.addEventListener('DOMContentLoaded', function () {
  const submitAction = document.getElementById('inputBook');
  submitAction.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageReady()) {
    loadDataInputFromStorage();
}
});

function isStorageReady() {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung local storage');
        return false;
    }
    return true;
  }
  function saveInput() {
    if (isStorageReady()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(KEY_LOCAL, parsed);
        document.dispatchEvent(new Event(SAVED_BOOK));
    }
  }
  document.addEventListener(SAVED_BOOK, function(){
    console.log(localStorage.getItem(KEY_LOCAL));
  });
  function loadDataInputFromStorage(){
    const takeData = localStorage.getItem(KEY_LOCAL);
    let dataInput = JSON.parse(takeData);
  
    if(dataInput !== null){
        for(const book of dataInput ){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;
  
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isCompleted);
    books.push(bookObject);
    saveInput();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  function generateId() {
    return +new Date();
  }
  function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    }
  }
  document.addEventListener(RENDER_EVENT, function (){
    console.log(books);
  });

  function newBook(bookShelf) {

    const {id, title, author, year, isCompleted} = bookShelf;
  
    const inputTitle = document.createElement('h3');
    inputTitle.innerHTML =  title;
   
    const inputAuthor = document.createElement('p');
    inputAuthor.innerHTML = "Writer: " + author;
  
    const inputYear = document.createElement('p');
    inputYear.innerHTML = "Year : " + year;
  
    const textContainer = document.createElement("div");
    textContainer.classList.add("container");
    textContainer.append(inputTitle, inputAuthor, inputYear);
    const bookContainer = document.createElement("section");
    bookContainer.setAttribute('id', `book-${id}`);
    bookContainer.append(textContainer);

    if(isCompleted){

        const undo = document.createElement('button');
        undo.innerText = "Not finish yet ";
        undo.classList.add('Blue');
        undo.addEventListener('click', function(){
            undoIsCompleted(id);
        });
    
        const remove = document.createElement('button');
        remove.innerText = "Delete Book";
        remove.classList.add('Red');
        remove.addEventListener('click', function(){
            removeIsCompleted(id);
        });
        bookContainer.append(undo,remove);
      }
      else{
        const complete = document.createElement('button');
        complete.innerText = "Already Read";
        complete.classList.add('Green');
        complete.addEventListener('click', function(){
            addIsCompleted(id);
        });
    
        const remove = document.createElement('button');
        remove.innerText = "Delete Book";
        remove.classList.add('Red');
        remove.addEventListener('click', function(){
            removeIsCompleted(id);
        });    
        bookContainer.append(complete,remove);
      }
      return bookContainer;
      }

    document.addEventListener(RENDER_EVENT, function () {
    const incompleteBook = document.getElementById('incompleteBookshelfList');
    incompleteBook.innerHTML = '';
    const completeBook = document.getElementById('completeBookshelfList');
    completeBook.innerHTML = '';
    for (const bookShelf of books) {
        const bookElement = newBook(bookShelf);
        if (bookShelf.isCompleted) {
        completeBook.append(bookElement);
        } else {
        incompleteBook.append(bookElement);
        }
    }
    return 1
    });
    function removeIsCompleted(bookId) {
        const bookToFind = findBookIndex(bookId);
       
        if (bookToFind === -1) return;
       
        books.splice(bookToFind, 1);
       
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveInput();
      }

    function findBookIndex(bookId) {
        for (const index in books) {
          if (books[index].id === bookId) {
            return index;
          }
        }
        return -1;
      }

    function addIsCompleted (bookId) {
        const bookToFind = findBook(bookId);
       
        if (bookToFind == null) return;
       
        bookToFind.isCompleted = true;
       
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveInput(books);
      }

    function findBook(bookId) {
        for (const newBook of books) {
          if (newBook.id === bookId) {
            return newBook;
          }
        }
        return null;
      }
       
    function undoIsCompleted(bookId) {
        const bookToFind = findBook(bookId);
       
        if (bookToFind == null) return;
       
        bookToFind.isCompleted = false;
       
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveInput();
      }

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';
    const listNotCompleted = 'incompleteBookshelfList';
    const listCompleted = 'completeBookshelfList';
    document.getElementById('searchBook').addEventListener("submit", function (event){
    event.preventDefault();
    const search = document.getElementById('searchBookTitle').value.toLowerCase();
    const list = document.querySelectorAll('.container > h3');
    for (book of list) {
        if (book.innerText.toLowerCase().includes(search)) {
            book.parentElement.parentElement.style.display = "block";
        } 
        else {
        book.parentElement.parentElement.style.display = "none";
        }
    }
    })