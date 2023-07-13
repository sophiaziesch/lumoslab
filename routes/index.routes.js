const express = require('express');
const { isLoggedIn } = require('../middleware/middleware');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {user : req.session.user});
});

module.exports = router;

router.get('/profile', isLoggedIn, (req, res)=>{
  res.render("profile", {user : req.session.user})
})


router.get("/logout", isLoggedIn, (req, res)=>{
delete req.session.user
res.redirect("/")
})