const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can logi
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
        data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
        accessToken,username
        }

        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let username = req.session.authorization.username;
    let review = req.query.review;
    if (review && books[isbn]) {
        let bookReviews = books[isbn].reviews;
        let reviewKeys = Object.keys(books[isbn].reviews);
        let indicator = 0;
        for (var i = 0; i < reviewKeys.length; i++) {
            if (username = reviewKeys[i]) {
                bookReviews[reviewKeys[i]] = review;
                indicator = 1;
            }
        }
        if (indicator === 0) {
            bookReviews[username] = review;
        }
        res.send(`The review for the book with isbn ${isbn} has been added/updated.`);
    }
});

regd_users.delete("/auth/review/:isbn",(req,res)=> {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        let reviewKeys = Object.keys(book.reviews);
        for (var i = 0; i < reviewKeys.length; i++) {
            if (reviewKeys[i] === req.session.authorization.username) {
                delete book.reviews[reviewKeys[i]];
            }
        }
    }
    res.send(`Reviews for the isbn  ${isbn} posted by the user ${req.session.authorization.username} deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

