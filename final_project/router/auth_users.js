const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  filter_user = users.filter((user) => user.username === username);
  if (filter_user.length > 0) {
    return true;
  }
  return false;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  filter_user = users.filter(
    (user) => user.username === username && user.password === password
  );  
  if (filter_user.length > 0) {
    return true;
  } 
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password

  if (!username || !password) {
    return res.status(404).json({ message: "Username or password is missing" });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(404).json({ message: "Invalid credentials" });
  }

  let accessToken = jwt.sign({ username: username }, "access", {
    expiresIn: 60 * 60,
  });

  req.session.authorization = {accessToken};

  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  let review = req.query.review;
  books[isbn]["reviews"][username] = review;

  res.status(200).json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  delete books[isbn]["reviews"][username];

  res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
