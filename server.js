//imports
const express = require("express");
const app = express();
const mysql = require("mysql");
const path = require("path");
const morgan = require("morgan");
const cookieparser = require('cookie-parser');
var session = require('express-session');
require('dotenv/config')
//middlewares
//req-res
app.use(morgan("dev"));
//view engine
app.set("view engine", "hbs");
//session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
//body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieparser());
//static directory
app.use(express.static("public"));
//global variables
app.locals.user = null;
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
})
//router config
app.use("/", require("./routes/page"));
app.use("/user", require("./routes/auth"));
//router
//db
const db = mysql.createConnection({
  host: "localhost",  
  user: "root",
  password: "Localhost123@",
  database: "nodelogin",
  multipleStatements: true,
});
db.connect((err) => {
  if (err) console.log(err);
  else console.log("MYSQL connected");
});
//server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server runs at ${port}`);
});
