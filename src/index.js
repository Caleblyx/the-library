// Import the functions you need from the SDKs you need
 import { initializeApp } from 'firebase/app';
 import { getFirestore, collection, query, where, orderBy, onSnapshot, serverTimestamp, addDoc, deleteDoc, getDocs, doc, updateDoc} from 'firebase/firestore'
 import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth'
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
 apiKey: "AIzaSyDuqNEVomb7J7GPWivOt7zpwE-kGPlBzBo",
 authDomain: "test-5e1bb.firebaseapp.com",
 databaseURL: "https://test-5e1bb-default-rtdb.asia-southeast1.firebasedatabase.app",
 projectId: "test-5e1bb",
 storageBucket: "test-5e1bb.appspot.com",
 messagingSenderId: "542108155551",
 appId: "1:542108155551:web:70647b7a2ff6f5534eecaa",
 measurementId: "G-ZPSY4R0CFS"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const firestore = getFirestore(app);
 const auth = getAuth(app);

class Library {
    constructor(){
        this.books = [];
    }

    getBookAtIndex(i) {
        return this.books[i];
    }
    addBook(book) {
        this.books.push(book);
    }

    removeBook(book) {
        let index = this.books.indexOf(book);
        this.books.splice(index, 1);
    }

    getBooks() {
        return this.books;
    }

    setLibrary(books) {
        this.books = books;
    }

    length(){
        return this.books.length;
    }

    containsBook(book){
        let res = this.books.some(libBook => book.equals(libBook));
        console.log(res);
        return res;
    }

}

class Book {
    constructor (title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    getInfo(){
        return `${this.title} by ${this.author}, ${this.numPages} pages, ${this.read? "read": "not read yet"}`;
    }
    equals(otherBook) {
        return this.title == otherBook.title && this.author == otherBook.author;
    }
}

let myLibrary = new Library();


function capitalise(s) {
    return s.slice(0,1).toUpperCase() + s.toLowerCase().slice(1);
}

function createBookCard(book) {
    let bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    for (let prop in book) {
        let isOwn = book.hasOwnProperty(prop);
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
            let textDiv = document.createElement("div");
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
    removeButton.addEventListener("click", e=>removeBookandCard(bookCard, book));
    bookCard.appendChild(removeButton);
    return bookCard;
}

class uiController {
    
}


async function getBookDocID(book) {
    const bookQuery = query(
        collection(firestore, 'books'),
        where('uid', '==', auth.currentUser.uid),
        where('title', '==', book.title),
        where('author', '==', book.author),
        where('pages', '==', book.pages)
    );
    const docID = await (await getDocs(bookQuery)).docs.map(doc => doc.id).join('');
    return docID;
}

async function deleteBookDoc(book) {
    let docID = await getBookDocID(book);
    let docRef = doc(firestore, 'books', docID);
    await deleteDoc(docRef);
    
}

async function removeBookandCard(card, book){
    if (auth.currentUser){
        await deleteBookDoc(book);
    } else {
    myLibrary.removeBook(book);
    libraryDiv.removeChild(card)
    updateLocalStorage()
    }
}

function displayBooks() {
    while(libraryDiv.firstChild) {
        libraryDiv.removeChild(libraryDiv.lastChild);
    }
    for (let i = 0; i < myLibrary.length(); i++) {
        let bookCard = createBookCard(myLibrary.getBookAtIndex(i));
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

async function toggleBookDocRead(book) {
    let docID = await getBookDocID(book);
    let docRef = doc(firestore, "books", docID)
    updateDoc(docRef, {"read": !book.read});
}

function toggleRead(book, e) {
    if (auth.currentUser) {
        toggleBookDocRead(book)
    } else {
    book.read = !book.read;
    e.target.setAttribute("value", `${book["read"]?"Finished":"Not finished yet"}`);
    updateLocalStorage();
    }
}

function processFormData(e) {
    e.preventDefault();
    const formData = new FormData(this);
    let book = new Book(formData.get("title"), formData.get("author"), formData.get("page"), formData.get("read")?true:false);
    let isInLibrary = myLibrary.containsBook(book);
    if (isInLibrary) {
        errorMessage.style.display = "block";
    } else{
        errorMessage.style.display = "none";
        let bookCard = createBookCard(book);
        libraryDiv.appendChild(bookCard);
        if (auth.currentUser) {
            addBookDoc(book);
        } else{
            myLibrary.addBook(book);
            updateLocalStorage();
        }
        modal.style.display = "none";
        form.reset();
    }
}


function updateLocalStorage(){
    localStorage.setItem("theLibrary", JSON.stringify(myLibrary.getBooks()))
}

function loadLocalStorage(){
    let localLib = JSON.parse(localStorage.getItem("theLibrary"))
    if (localLib == null) {
        return
    } else {
        myLibrary.setLibrary(localLib);
    }
}
function login() {
    const provider = new GoogleAuthProvider(auth);
    signInWithPopup(auth, provider);
}

function logout() {
    signOut(auth);
}

function updateMessage() {
    let message = document.querySelector(".message");
    if (auth.currentUser) {
        message.textContent = "Welcome, " + auth.currentUser.displayName + "!";
    } else {
        message.textContent = "Welcome, stranger!"
    }
}

function updateLogButton() {
    if (auth.currentUser) {
        loginButton.value = "Click here to Log Out";
        loginButton.removeEventListener("click", login)
        loginButton.addEventListener("click", logout);
    } else {
        loginButton.value = "Click here to Log In";
        loginButton.removeEventListener("click", logout)
        loginButton.addEventListener("click", login);
    }
}
   

let unsubscribeUser;
async function setLiveQuery() {
    const userBookQuery = query(
        collection(firestore, 'books'),
        where('uid', '==', auth.currentUser.uid),
        orderBy('date added')
    );
    unsubscribeUser = onSnapshot(userBookQuery, (querySnapshot) => {console.log(myLibrary); myLibrary.setLibrary(querySnapshot.docs.map(book =>docToBook(book))); displayBooks();});
}

function docToBook(doc) {
    return new Book(doc.data().title, doc.data().author, doc.data().pages, doc.data().read);
}

function bookToDoc(book) {
    return {
        "uid" : auth.currentUser.uid,
        "title": book.title,
        "author": book.author,
        "pages": book.pages,
        "read": book.read,
        "date added": serverTimestamp()
    };
}

async function addBookDoc(book) {
    let doc = bookToDoc(book);
    let booksCollection = collection(firestore, 'books');
    const newDoc = await addDoc(booksCollection, doc);
}

//Detect auth state
onAuthStateChanged(auth, user => {
    if (user) {
        console.log('logged in!');
        console.log(user);
        setLiveQuery();
        updateLogButton();
        updateMessage();
    } else {
        if (unsubscribeUser) {
            unsubscribeUser();
        }
        console.log('No user');
        loadLocalStorage();
        displayBooks();
        updateLogButton();
        updateMessage();
    }
    })

const addBookButton = document.querySelector(".add-book");
const modal = document.querySelector(".modal");
const form = document.querySelector("form");
const errorMessage = document.querySelector(".error-message");
const loginButton = document.querySelector(".log-button");
addBookButton.addEventListener("click", showModal);
form.addEventListener("submit", processFormData);
window.addEventListener("click", closeModal);


let libraryDiv = document.querySelector('.library');
let prompt = document.querySelector('.prompt');

// Options for the observer (which mutations to observe)
const config = {childList: true};

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if (libraryDiv.hasChildNodes()){
                prompt.style.display = "none";
            } else {
                prompt.style.display = "block";
            }
        }
    }
};

const observer = new MutationObserver(callback);
observer.observe(libraryDiv, config);
