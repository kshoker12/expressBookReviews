const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios').default;

const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shopf
public_users.get('/',function (req, res) {
    var data = {
        "books": books
    }
    res.send(data);
});

// public_users.get('/',function (req, res) {
//     promise_get.then();
// });

// let promise_get = new Promise((resolve,reject)=>{
//     var data = {
//         "books": books
//     }
//     resolve(data);
// })


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let bookKeys = Object.keys(books);
  var data = {
      booksbyauthor: []
    };
  for (var i = 0; i < bookKeys.length; i++) {
      let curr = books[bookKeys[i]];
      if (curr.author === author) {
          let temp = {
              isbn: i+1,
              title: curr.title,
              reviews: curr.reviews
          }
          data.booksbyauthor.push(temp);
      }
  }
  res.send(data);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksKey = Object.keys(books);
    var data = {
        booksbytitle: []
    }
    for (var i = 0; i < booksKey.length; i++) {
        let curr = books[booksKey[i]];
        if (curr.title === title) {
            let temp = {
                isbn: i+1,
                author: curr.author,
                reviews: curr.reviews
            }
            data.booksbytitle.push(temp);
        }
    }
    res.send(data);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let booksKey = Object.keys(books);
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;

