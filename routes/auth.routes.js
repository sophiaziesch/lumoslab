const express = require('express');
const router = express.Router();

const User = require('../models/User.model');
const bcrypt = require("bcryptjs")

/* GET signup page */
router.get("/signup", (req, res) => {
    res.render("auth/signup")
})

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
        //TODO set a redirecting page after signing up 
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
})

//GET login page
router.get("/login", (req, res) => {
    res.render("auth/login")
})

//POST login page
router.post('/login', async (req, res) => {
    //TODO create a form to get the req.body
    const currentUser = req.body
    try {

        //TODO choose either email or usernam to log in, for now email
        const checkedUser = await User.findOne({ username: currentUser.username })
        if (checkedUser) {
            //if the user exist in DB
            //use "compareSync" to compare a string with an encrypted string
            if (bcrypt.compareSync(currentUser.password, checkedUser.passwordHash)) {
                //creating a copy of user
                const loggedUser = { ...checkedUser._doc }
                //deleting the password so it doesnt appear in front
                delete loggedUser.passwordHash
                //TODO after setting SESSION do this : req.session.currentUser = loggedUser
                //TODO set a redirecting page after logging in
                res.redirect("/")
            }
        }
        else{
            //TODO set an error message and render/redirect to another page
            console.log("Wrong email or password");
            res.redirect("/auth/login")
        }
    } catch (error) {
    }
})






module.exports = router;
