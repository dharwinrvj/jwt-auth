//imports
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const session = require('express-session');
const token = require('../authenticators/token');
//db
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Localhost123@",
  database: "nodelogin",
  multipleStatements: true,
});
//router
//get register
router.get("/register", (req, res) => {
  res.render("register");
});
//post register
router.post("/register", (req, res) => {
  console.log(req.body);
  const { name, email, password, cpassword } = req.body;
  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) console.log(err);
      if (results.length > 0)
        return res.render("register", { message: "Email is already in use !" });
      else if (password != cpassword)
        return res.render("register", { message: "Password do not match !" });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hashPassword) => {
          if (err) console.log(err);
          console.log(hashPassword);
          db.query(
            "INSERT INTO users SET ?",
            { name: name, email: email, password: hashPassword },
            (err, results) => {
              if (err) return console.log(err);
              console.log(results);
              res.render("login", { message: "User Registered ! Let's Login !" });
            }
          );
        });
      });
    }
  );
});
//get login
router.get("/login", (req, res) => {
  res.render("login");
});
//post login
router.post("/login", (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) {
        return console.log(err);
      }
      else if (results.length == 0) {
        return res.render("login", { message: "Wrong Email ID !" });
      }
      else {
        var user = results[0]
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) {
            return console.log(err);
          }
          else if (!match) return res.render("login", { message: "Wrong Password !" });
          else {
            const jwt = token.tokenGenerator(user._id);
            res.cookie('jwttoken', jwt, { maxAge: 100000, httpOnly: true })
            req.session.loggedin = true;
            req.session.user = user;
            res.redirect('/');
          }
        });

      }
    }
    )
  }
  catch (err) {
    console.log(err);
  }
});
router.get('/logout', (req, res) => {
  delete req.session.user;
  req.session.destroy();
  res.redirect('login');
})
module.exports = router;
