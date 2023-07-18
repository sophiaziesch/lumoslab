const express = require('express');
const { isLoggedIn } = require('../middleware/middleware');
const Potion = require('../models/Potion.model');
const User = require('../models/User.model');
const router = express.Router();

let loggedIn = true

//Cloudinary middleware
const uploader = require('../config/cloudinary.config.js');

//route already set in app.js "/potions--"
//GET all potions page
router.get('/', async (req, res) => {
    if (req.session.user) {
        loggedIn = true
    } else {
        loggedIn = false
    }
    try {
        const allPotions = await Potion.find()
        res.render("potions-pages/allPotions", { allPotions, loggedIn })
    } catch (error) {
        console.error(error);
    }
})

//POST search on all potions page
router.post("/", async (req, res) => {
    if (req.session.user) {
        loggedIn = true
    } else {
        loggedIn = false
    }
    const potionNameSearch = req.body.searchPotions
    try {
        const searchResults = await Potion.find({name : potionNameSearch})
        console.log(searchResults);
        res.render("potions-pages/allPotions", { allPotions : searchResults, loggedIn })
    } catch (error) {
        console.error(error)
    }
})

//GET ONE potion page
router.get('/potion/:potionName', async (req, res) => {
    const potionName = req.params.potionName
    const currentUser = req.session.user
    if (req.session.user) {
        loggedIn = true
    } else {
        loggedIn = false
    }
    try {
        const currentPotion = await Potion.findOne({ name: potionName })
        res.render("potions-pages/potion", { potion: currentPotion, user: currentUser, loggedIn })
    } catch (error) {
        console.error(error)
    }
})

//GET create page only if you're logged in
router.get('/create', isLoggedIn, (req, res) => {
    res.render("potions-pages/create", { loggedIn })
})

//POST create page using CLOUDINARY as a middleware
router.post('/create', uploader.single("img_url"), async (req, res) => {
    let aPotion
    const currentInventor = req.session.user.username
    //checking if user inserting an image, if not, the default one will be display
    if (req.file) {
        //creating a copy of the request body and assign the image path to the img_url property to match DB
        aPotion = { ...req.body, img_url: req.file.path, inventor: currentInventor }
    } else {
        aPotion = { ...req.body, inventor: currentInventor }
    }
    try {
        const newPotion = await Potion.create(aPotion)
        //find all potions of current user
        const myPotions = await Potion.find({ inventor: currentInventor })
        //update the current user potions inventory
        await User.findOneAndUpdate({ username: currentInventor }, { potions: myPotions })
        res.redirect(`/potions/potion/${newPotion.name}`)
    } catch (error) {
        console.error(error);
    }
})

//GET MyPotion page
router.get('/my-potions', isLoggedIn, async (req, res) => {
    loggedIn = true
    const currentUsername = req.session.user.username
    try {
        const myPotions = await User.findOne({ username: currentUsername }).populate("potions")
        res.render('potions-pages/myPotions', { myPotions: myPotions.potions, loggedIn })
    } catch (error) {
        console.error(error)
    }
})

//GET go to Update page my potion
router.get("/potion/:nameOfPotion/update", isLoggedIn, async (req, res) => {
    loggedIn = true
    const potionName = req.params.nameOfPotion
    try {
        const myCurrentPotion = await Potion.findOne({ name: potionName })
        console.log(myCurrentPotion);
        res.render("potions-pages/update", { potion: myCurrentPotion, loggedIn })
    } catch (error) {
        console.error(error)
    }
})

//POST updating the current potion
router.post("/potion/:nameOfPotion/update", isLoggedIn, uploader.single("img_url"), async (req, res) => {
    const potionName = req.params.nameOfPotion

    let currentPotionUpdate

    if (req.file) {
        //creating a copy of the request body and assign the image path to the img_url property to match DB
        currentPotionUpdate = { ...req.body, img_url: req.file.path }
    } else {
        currentPotionUpdate = { ...req.body }
    }
    try {
        const currentPotion = await Potion.findOne({ name: potionName })
        const myCurrentUpdated = await Potion.findByIdAndUpdate(currentPotion._id, currentPotionUpdate)
        const myUpdatedPotion = await Potion.findById(currentPotion._id)
        res.redirect(`/potions/potion/${myUpdatedPotion.name}`)
    } catch (error) {
        console.error(error)
    }
})

//GET Delete my potion
router.get("/potion/:nameOfPotion/delete", isLoggedIn, async (req, res) => {
    const potionName = req.params.nameOfPotion
    try {
        await Potion.findOneAndDelete({ name: potionName })
        res.redirect("/potions/my-potions")
    } catch (error) {
        console.error(error)
    }
})

//GET favorite potions page
router.get('/my-favorites', isLoggedIn, async (req, res) => {
    loggedIn = true
    const currentUsername = req.session.user.username
    try {
        const myFavorites = await User.findOne({ username: currentUsername }).populate("favorites")
        res.render('potions-pages/myFavorites', { myFavorites: myFavorites.potions, loggedIn })
    } catch (error) {
        console.error(error)
    }
})


module.exports = router;
