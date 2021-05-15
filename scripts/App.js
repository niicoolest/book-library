var App = (function () {
    const FIREBASE_API_KEY = 'AIzaSyCDhOe-E_2DIx8PN3fdQd_uEA6zlCBryzw';
    const FIREBASE_AUTH_DOMAIN = 'library-c22b8.firebaseapp.com';
    const FIREBASE_PROJECT_ID = 'library-c22b8';
    const FIREBASE_STORAGE_BUCKET = "library-c22b8.appspot.com";
    const FIREBASE_MESSAGING_SENDER_ID = "446666591755";
    const FIREBASE_APP_ID = "1:446666591755:web:f40a1da71999182a65c10e";
    const FIREBASE_MEASUREMENT_ID = "G-DQ9BM6LM9V";
    
    const BOOK_TITLE_ID = "title";
    const BOOK_AUTHOR_ID = "author";
    const BOOK_REVIEW_ID = "review";
    const BOOK_ADDED_BY_ID = "added-by";

    var db;
    var totalNumberOfBooks = 0;

    class Book {
        constructor(id, title, author, review, addedBy) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.review = review;
            this.addedBy = addedBy;
        }

        setId(id) {
            this.id = id;
        }
    }

    function initFireBase() {
        // Initialize Cloud Firestore through Firebase
        firebase.initializeApp({
            apiKey: FIREBASE_API_KEY,
            authDomain: FIREBASE_AUTH_DOMAIN,
            projectId: FIREBASE_PROJECT_ID,
            storageBucket: FIREBASE_STORAGE_BUCKET,
            messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
            appId: FIREBASE_APP_ID,
            measurementId: FIREBASE_MEASUREMENT_ID
        });
    }

    function addNewBook() {
        let newBook = new Book(null, document.getElementById(BOOK_TITLE_ID).value, 
            document.getElementById(BOOK_AUTHOR_ID).value, document.getElementById(BOOK_REVIEW_ID).value,
            document.getElementById(BOOK_ADDED_BY_ID).value);

        db.collection("books").add({
            title: newBook.title,
            author: newBook.author,
            added_by: newBook.addedBy,
            brief_review: newBook.review
        })
        .then((docRef) => {
            newBook.setId(docRef.id);
            document.getElementById("book-list").appendChild(
                createBook(newBook.id, newBook.title, newBook.author, newBook.review,
                newBook.addedBy));

            totalNumberOfBooks = totalNumberOfBooks + 1;
            setTotalNumOfBooks();
            resetBookForm();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            resetBookForm();
        });
    }


    function resetBookForm() {
        document.getElementById(BOOK_TITLE_ID).value = '';
        document.getElementById(BOOK_AUTHOR_ID).value = '';
        document.getElementById(BOOK_ADDED_BY_ID).value = '';
        document.getElementById(BOOK_REVIEW_ID).value = '';
    }


    function createBook(id, titleVal, authorVal, reviewVal, addedByVal) {
        const CLASS_ATTRIB = "class";

        const BOOK_ELEMENT_STYLE = "bg-green-100 p-6 rounded-lg shadow-lg flex-2 max-h-80 max-w-md book-details";
        let book = document.createElement("div");
        book.setAttribute(CLASS_ATTRIB, BOOK_ELEMENT_STYLE);
        book.setAttribute("id", id);

        const BOOK_ELEMENT_TITLE = "book-title text-3xl font-bold text-gray-800";
        let title = document.createElement("h2");
        title.setAttribute(CLASS_ATTRIB, BOOK_ELEMENT_TITLE);
        title.innerText = titleVal;

        const BOOK_ELEMENT_AUTHOR = "book-author text-gray-700 text-2xl";
        let author = document.createElement("p");
        author.setAttribute(CLASS_ATTRIB, BOOK_ELEMENT_AUTHOR);
        author.innerText = "Author: ".concat(authorVal);

        const BOOK_ELEMENT_REVIEW = "book-comment text-gray-700";
        let review = document.createElement("p");
        review.setAttribute(CLASS_ATTRIB, BOOK_ELEMENT_REVIEW);
        review.innerHTML = "<em>".concat(reviewVal).concat("</em>");

        const BOOK_ELEMENT_ADDEDBY = "added-by text-gray-700";
        let addedBy = document.createElement("p");
        addedBy.setAttribute(CLASS_ATTRIB, BOOK_ELEMENT_ADDEDBY);
        addedBy.innerText = "Added By: ".concat(addedByVal);

        let brElem = document.createElement("br");
        let brElem1 = document.createElement("br");

        book.appendChild(title);
        book.appendChild(author);
        book.appendChild(brElem1);
        book.appendChild(review);
        book.appendChild(brElem);
        book.appendChild(addedBy);

        return book;
    }


    function populateBookList() {
        let bookList = document.getElementById("book-list");

        db.collection("books").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let bookDetails = doc.data();
                bookList.appendChild(createBook(doc.id, bookDetails.title, bookDetails.author, 
                    bookDetails.brief_review, bookDetails.added_by));
                console.log(`${doc.id} => ${doc.data().title}`);
            });
            totalNumberOfBooks = querySnapshot.size;
            setTotalNumOfBooks();
        });
    }

    function setTotalNumOfBooks() {
        document.getElementById("book-total").innerText = "Total # of Books : ".concat(totalNumberOfBooks);
    }


    function toggleModal () {
        const body = document.querySelector('body')
        const modal = document.querySelector('.modal')
        modal.classList.toggle('opacity-0')
        modal.classList.toggle('pointer-events-none')
        body.classList.toggle('modal-active')
    }

    function addButtonListeners() {
        let openmodal = document.querySelectorAll('.modal-open')
        for (var i = 0; i < openmodal.length; i++) {
            openmodal[i].addEventListener('click', function(event){
                event.preventDefault()
                toggleModal()
            });
        }

        const overlay = document.querySelector('.modal-overlay')
        overlay.addEventListener('click', toggleModal)

        let closemodal = document.querySelectorAll('.modal-close')
        for (var i = 0; i < closemodal.length; i++) {
            closemodal[i].addEventListener('click', toggleModal)
        }

        document.onkeydown = function(evt) {
            evt = evt || window.event
            var isEscape = false
            if ("key" in evt) {
                isEscape = (evt.key === "Escape" || evt.key === "Esc")
            } else {
                isEscape = (evt.keyCode === 27)
            }
            if (isEscape && document.body.classList.contains('modal-active')) {
                toggleModal()
            }
        };

        var addNewBookButton = document.getElementById("add-book");
        addNewBookButton.addEventListener("click", addNewBook);

    }

    function init() {
        initFireBase();
        db = firebase.firestore();
        addButtonListeners();
        populateBookList();
    }

    return {
        initialize: init
    }
})();

App.initialize();
