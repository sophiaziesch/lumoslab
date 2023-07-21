const express = require('express');
const router = express.Router();

const User = require('../models/User.model');
const bcrypt = require("bcryptjs")

let loggedIn = false

/* GET signup page */
router.get("/signup", (req, res) => {
    if (req.session.user) {
        loggedIn = true
    } else {
        loggedIn = false
    }
    res.render("auth/signup", { loggedIn })
})

//route already set in app.js "/auth--"

//POST signup page, create a new User
router.post("/signup", async (req, res) => {
    //Makin a copy of the request body {username: "blabla", password: "123"}
    const payload = { ...req.body }
    //Deleting the password from the payload copy so we dont show it
    delete payload.password
    //generatiing a SALT to use it in "hashSync()" method to encrypt our pw
    const salt = bcrypt.genSaltSync(13)
    //encrypting the current password (from req.body) and asign it to a new property matching our data
    payload.passwordHash = bcrypt.hashSync(req.body.password, salt)

    try {
        const newUser = await User.create(payload)
        delete payload.passwordHash
        req.session.user = payload
        res.redirect('/profile')
    } catch (error) {
        console.log(error);
    }
})

//GET login page
router.get("/login", (req, res) => {
    res.render("auth/login", { loggedIn })
})

//POST login page
router.post('/login', async (req, res) => {
    const currentUser = req.body
    const errorMessage = "Unknown user or password"

    try {
        const checkedUser = await User.findOne({ username: currentUser.username })
        if (checkedUser) {
            //if the user exist in DB
            //use "compareSync" to compare a string with an encrypted string
            if (bcrypt.compareSync(currentUser.password, checkedUser.passwordHash)) {
                //creating a copy of user
                const loggedUser = { ...checkedUser._doc }
                //deleting the password from copy so it doesnt appear in front
                delete loggedUser.passwordHash
                //creating a new property USER in my req.session 
                req.session.user = loggedUser
                res.redirect('/')
            }
            res.render("auth/login", { username: currentUser.username, errorMessage, loggedIn })
        }
        else {
            res.render("auth/login", { username: currentUser.username, errorMessage, loggedIn })
        }
    } catch (error) {
    }
})

module.exports = router;
