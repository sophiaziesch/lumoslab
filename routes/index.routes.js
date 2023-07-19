const express = require('express');
const { isLoggedIn } = require('../middleware/middleware');
const User = require('../models/User.model');
const router = express.Router();
const bcrypt = require("bcryptjs")

const uploader = require('../config/cloudinary.config.js');

let loggedIn

/* GET home page */
router.get("/", (req, res, next) => {
  if (req.session.user) {
    loggedIn = true
  } else {
    loggedIn = false
  }
  res.render("index", { user: req.session.user, loggedIn });
});

router.get('/profile', isLoggedIn, async (req, res) => {
  loggedIn = true
  const currentUsername = req.session.user.username
  console.log(currentUsername);
  try {
    const currentUser = await User.findOne({username : currentUsername}).populate("potions", "favorites")
    res.render("profile", { user: currentUser, loggedIn })
  } catch (error) {
    console.error(error)
  }

})

//GET update user info page
router.get('/profile/update', isLoggedIn, async (req, res) => {
  loggedIn = true
  const currentUser = req.session.user
  try {
    const updateUser = await User.findOne({ username: currentUser.username })
    res.render('profile-update', { user: updateUser, loggedIn })
  } catch (error) {
    console.error(error)
  }
})

//POST update user info page
router.post('/profile/update', isLoggedIn, uploader.single("img_url"), async (req, res) => {
  loggedIn = true
  const currentUser = req.session.user
  const actualPassword = req.body.password
  const newPassword = req.body.newPassword
  const confirmedNewPassword = req.body.confirmedNewPassword
  const newInfos = {}

  try {
    //finding the user in databse
    const findCurrentUser = await User.findOne({ username: currentUser.username })

    //If the user wants to change his password
    if (actualPassword || newPassword || confirmedNewPassword) {
      //checking if the pw typed is the same as actual pw in databse
      if (bcrypt.compareSync(actualPassword, findCurrentUser.passwordHash)) {
        //then if the new pw and the confirmed pw match
        if (newPassword === confirmedNewPassword) {
          //generating a SALT to use it in "hashSync()" method to encrypt our new pw
          const salt = bcrypt.genSaltSync(13)
          //encrypting the newpassword and asign it to a new property matching our data
          newInfos.passwordHash = bcrypt.hashSync(newPassword, salt)
        } else {
          res.render('profile-update', { wrongNewPassword: "The new password and the confirmation doesn't match, try again", loggedIn })
        }
      } else {
        res.render('profile-update', { wrongPassword: "Wrong Password", loggedIn })
      }
    }

    //If an image is uplaoded
    if (req.file) {
      //then we create a new property with the url of the img on newInfos
      newInfos.img_url = req.file.path
    }

    //Update user infos in the database
    const updateUser = await User.findOneAndUpdate({ username: currentUser.username }, newInfos)
    res.redirect("/profile")

  } catch (error) {
    console.error(error)
  }
})

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy()
  res.redirect("/")
})


module.exports = router;