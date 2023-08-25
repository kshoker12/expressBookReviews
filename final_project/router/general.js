const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

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
public_users.get('/', function(req,res) {
    let promise = new Promise((resolve, reject)=>{
        var data = {
            "books": books
        }
        resolve(data);
    })

    promise.then((data)=>{
        res.send(data);
    })  
})



// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let promise = new Promise((resolve,reject)=>{
        const isbn = req.params.isbn;
        let keys = Object.keys(books);
        let indicator = 0;
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === isbn) {
                resolve(isbn);
                indicator = 1;
            }
        }
        if (indicator === 0) {
            reject("Book not found");
        }
    });
    promise.then((isbn)=>{
        res.send(books[isbn]);
    }).catch((error)=>{
        res.send(error);
    });

 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let promise = new Promise((resolve,reject)=>{
        const author = req.params.author;
        let bookKeys = Object.keys(books);
        var data = {
            booksbyauthor: []
        };
        let indicator = 0;
        for (var i = 0; i < bookKeys.length; i++) {
            let curr = books[bookKeys[i]];
            if (curr.author === author) {
                let temp = {
                    isbn: i+1,
                    title: curr.title,
                    reviews: curr.reviews
                }
                data.booksbyauthor.push(temp);
                indicator++;
            }
        }
        if (indicator) {
            resolve(data);
        } else {
            reject("Author not found");
        }
    });
    promise.then((data)=>{
        res.send(data);
    }).catch((error)=>{
        res.send(error);
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let promise = new Promise((resolve, reject)=>{
        const title = req.params.title;
        let booksKey = Object.keys(books);
        var data = {
            booksbytitle: []
        }
        let indicator = 0;

        for (var i = 0; i < booksKey.length; i++) {
            let curr = books[booksKey[i]];
            if (curr.title === title) {
                let temp = {
                    isbn: i+1,
                    author: curr.author,
                    reviews: curr.reviews
                }
                indicator++;
                data.booksbytitle.push(temp);
            }
        }
        if (indicator) {
            resolve(data);
        } else {
            reject("Title not found");
        }
    });
    promise.then((data)=>{
        res.send(data);
    }).catch((error)=>{
        res.send(error);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let booksKey = Object.keys(books);
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;

