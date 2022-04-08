//imports
const express = require("express");
const router = express.Router();
const token = require('../authenticators/token');
//router
//get profile
router.get('/', token.tokenValidator, (req, res) => {
  if (req.session.loggedin) {
    res.render('profile')
  }
  else {
    res.render("login", { message: "Please Login !" });
  }
});
module.exports = router;
