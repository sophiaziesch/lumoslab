const express = require('express');
const { isLoggedIn } = require('../middleware/middleware');
const User = require('../models/User.model');
const router = express.Router();

const uploader = require('../config/cloudinary.config.js');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {user : req.session.user});
});

router.get('/profile', isLoggedIn, (req, res)=>{
  res.render("profile", {user : req.session.user})
})

//GET update user info page
router.get('/profile/update',isLoggedIn, async (req, res)=>{
  const currentUser = req.session.user
  try {
    const updateUser = await User.findOne({username : currentUser.username})
    res.render('profile-update', {user : updateUser})
  } catch (error) {
    console.error(error)
  }
})

//POST update user info page
router.post('/profile/update',isLoggedIn, uploader.single("img_url"), async (req, res)=>{
  const currentUser = req.session.user
  try {
    const updateUser = await User.findOneAndUpdate({username : currentUser.username}, req.body)
  } catch (error) {
    console.error(error)
  }
})

router.get("/logout", isLoggedIn, (req, res)=>{
  delete req.session.user
  res.redirect("/")
})


module.exports = router;
