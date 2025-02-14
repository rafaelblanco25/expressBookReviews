const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({ message: "Username or password is missing" });
  }

  if (isValid(username)){
    return res.status(404).json({ message: "Username already exists" });
  }

  users.push({username:username, password:password});

  res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  let booksPromise = new Promise((resolve, reject) => {
    if (Object.keys(books).length === 0) {
      reject("No books available");
    }
    resolve(books);
  } );

  booksPromise.then((books) => {
    res.send(JSON.stringify({ books }, null, 4));
  }).catch((err) => {
    res.status(404).json({ message: "No books available" });
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let bookDetailsPromise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    let filter_book = books[isbn];
    if (!filter_book) {
      reject("Book not found");
    }
    resolve(filter_book);
  });

  bookDetailsPromise.then((filter_book) => {
    res.send(JSON.stringify({ filter_book }, null, 4));
  }).catch((err) => {
    res.status(404).json({ message: "Book not found" });
  });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let bookDetailsPromise = new Promise((resolve, reject) => {
    const author = req.params.author;
    let filter_books = {};
    for (const [key, value] of Object.entries(books)) {
      if (value["author"] === author) {
        filter_books[key] = value;
      }
    }
    if (Object.keys(filter_books).length === 0) {
      reject("Author not found");
    }
    resolve(filter_books);
  });

  bookDetailsPromise.then((filter_books) => {
    res.send(JSON.stringify({ filter_books }, null, 4));
  }).catch((err) => {
    res.status(404).json({ message: "Author not found" });  
  });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let booksPromise = new Promise((resolve, reject) => {
    const title = req.params.title;
    let filter_books = {};
    for (const [key, value] of Object.entries(books)) {
      if (value["title"] === title) {
        filter_books[key] = value;
      }
    }
    if (Object.keys(filter_books).length === 0) {
      reject("Title not found");
    }
    resolve(filter_books);
  });

  booksPromise.then((filter_books) => { 
    res.send(JSON.stringify({ filter_books }, null, 4));
  }).catch((err) => {
    res.status(404).json({ message: "Title not found" });
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  book_reviews = books[isbn] ? books[isbn]["reviews"] : {};

  res.send(JSON.stringify({ book_reviews }, null, 4));
});

module.exports.general = public_users;
