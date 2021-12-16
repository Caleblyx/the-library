let myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function() {
    s = `${this.title} by ${this.author}, ${this.numPages} pages, ${this.read? "read": "not read yet"}`;
    return s;
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function capitalise(s) {
    return s.slice(0,1).toUpperCase() + s.toLowerCase().slice(1);
}

function createBookCard(book) {
    let bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.setAttribute("data", myLibrary.indexOf(book));
    for (let prop in book) {
        isOwn = book.hasOwnProperty(prop);
        if (!isOwn) {
            continue;
        }
        let cardElement;
        if (prop == "read") {
            cardElement = document.createElement("input");
            cardElement.setAttribute("type","button");
            cardElement.setAttribute("value", `${book[prop]?"Finished":"Not finished yet"}`);
            cardElement.addEventListener("click", e => toggleRead(book, e));
        } else {
            cardElement = document.createElement("div");
            textDiv = document.createElement("div");
            textDiv.classList.add("text-div");
            textDiv.textContent = `${book[prop]}`;
            if (prop == "pages") {
                textDiv.textContent+= " " + prop
            }
            cardElement.appendChild(textDiv);
        }
        let className = "card-"+prop.toLowerCase();
        cardElement.classList.add(className);
        bookCard.appendChild(cardElement);
    }
    let removeButton = document.createElement("input");
    removeButton.setAttribute("type", "button");
    removeButton.setAttribute("value", "Remove");
    removeButton.addEventListener("click", e=>removeBook(bookCard));
    bookCard.appendChild(removeButton);
    return bookCard;
}

function removeBook(card){
    let i = card.getAttribute("data");
    myLibrary.splice(i, 1);
    libraryDiv.removeChild(card)
}

function displayBooks() {
    for (let i = 0; i < myLibrary.length; i++) {
        let bookCard = createBookCard(myLibrary[i]);
        libraryDiv.appendChild(bookCard);
    }
}   

function showModal(){
    modal.style.display = "flex";
}

function closeModal(e) {
    if (e.target == modal) {
        modal.style.display = "none";
    }
}

function toggleRead(book, e) {
    book.read = !book.read;
    e.target.setAttribute("value", `${book["read"]?"Finished":"Not finished yet"}`);
}

function processFormData(e) {
    e.preventDefault();
    const formData = new FormData(this);
    let book = new Book(formData.get("title"), formData.get("author"), formData.get("page"), formData.get("read")?true:false);
    let isInLibrary = myLibrary.some(libBook => sameBook(book, libBook));
    if (isInLibrary) {
        errorMessage.style.display = "block";
    } else{
        errorMessage.style.display = "none";
        myLibrary.push(book);
        let bookCard = createBookCard(book);
        libraryDiv.appendChild(bookCard);
        modal.style.display = "none";
        form.reset();
    }
}

function sameBook(b1, b2) {
    return b1.title == b2.title && b1.author == b2.author;
}

const addBookButton = document.querySelector(".add-book");
const modal = document.querySelector(".modal");
const form = document.querySelector("form");
const errorMessage = document.querySelector(".error-message");
addBookButton.addEventListener("click", showModal);
form.addEventListener("submit", processFormData);
window.addEventListener("click", closeModal);

let testBook = new Book("The Ultimate Hitchhiker's Guide to the Galaxy", "Douglas Adams", 815, false);
let book = new Book("Fight Club", "Chuck Palahniuck", 20);

addBookToLibrary(testBook);
addBookToLibrary(book);

libraryDiv = document.querySelector('.library');

displayBooks();
