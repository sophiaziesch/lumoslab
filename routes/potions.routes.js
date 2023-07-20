const express = require('express');
const { isLoggedIn } = require('../middleware/middleware');
const Potion = require('../models/Potion.model');
const User = require('../models/User.model');
const router = express.Router();

//Set the logging status to true by default (true when a user is logged in). 
//Will be used to display differents links on navbar
let loggedIn = true

//Cloudinary middleware
const uploader = require('../config/cloudinary.config.js');

//Function that will uppercase the first letter of a string
function uppercaseFirstChar(string){
    const arrayString = string.split('')
    arrayString[0] = arrayString[0].toUpperCase()
    return arrayString.join('')
}

//route already set in app.js "/potions--"
//GET all potions page
router.get('/', async (req, res) => {
    //checking if a user is logged in and update the loggedIn variable
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
    const potionNameSearch = uppercaseFirstChar(req.body.searchPotions)
    try {
        const searchResults = await Potion.find({ name: potionNameSearch })
        res.render("potions-pages/allPotions", { allPotions: searchResults, loggedIn })
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
    let isPotionFavorite
    try {
        if(loggedIn){
            const findPotion = await Potion.findOne({name : potionName})
            const findUser = await User.findOne({username : currentUser.username})
            //finding the potion index in the favorites array
            isPotionFavorite = findUser.favorites.includes(findPotion._id)
        }
        const currentPotion = await Potion.findOne({ name: potionName })
        res.render("potions-pages/potion", { potion: currentPotion, user: currentUser, loggedIn, isPotionFavorite })
    } catch (error) {
        console.error(error)
    }
})

//GET create page only if you're logged in
router.get('/create', isLoggedIn, (req, res) => {
    loggedIn = true
    res.render("potions-pages/create", { loggedIn })
})

//POST create page using CLOUDINARY as a middleware
router.post('/create', uploader.single("img_url"), async (req, res) => {
    let aPotion
    const currentCreator = req.session.user.username
    const potionName = uppercaseFirstChar(req.body.name)
    
    //checking if user inserting an image, if not, the default one will be display
    if (req.file) {
        //creating a copy of the request body and assign the image path to the img_url property to match DB
        aPotion = { ...req.body, name : potionName, img_url: req.file.path, createdBy: currentCreator }
    } else {
        //put a random potion image if no file is uplaoded
        const potionIMG1 = "/images/default_pot.png"
        const potionIMG2 = "/images/default_pot2.png"
        const potionIMG3 = "/images/default_pot3.png"
        const randomIMG = Math.random() * 3
        if(randomIMG <= 1){
            aPotion = { ...req.body, name : potionName, img_url: potionIMG1, createdBy: currentCreator }
        }else if(randomIMG > 1 && randomIMG <= 2){
            aPotion = { ...req.body, name : potionName, img_url: potionIMG2, createdBy: currentCreator }
        }else if(randomIMG > 2 && randomIMG <= 3){
            aPotion = { ...req.body, name : potionName, img_url: potionIMG3, createdBy: currentCreator }
        }
    }
    try {
        //If the name already exist in the databse
        const doesNameExist = await Potion.findOne({ name: aPotion.name })
        if (doesNameExist) {
            //then render the create page with error message
            res.render("potions-pages/create", { loggedIn, errorMessage: "This potion name already exist" })
        }
        const newPotion = await Potion.create(aPotion)
        //find all potions of current user
        const myPotions = await Potion.find({createdBy: currentCreator })
        //update the current user potions createdBy
        await User.findOneAndUpdate({ username: currentCreator }, { potions: myPotions })
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
        res.render("potions-pages/update", { potion: myCurrentPotion, loggedIn })
    } catch (error) {
        console.error(error)
    }
})

//POST updating the current potion
router.post("/potion/:nameOfPotion/update", isLoggedIn, uploader.single("img_url"), async (req, res) => {
    const potionName = req.params.nameOfPotion
    let currentPotionUpdate
    const newName = uppercaseFirstChar(req.body.name)
    if (req.file) {
        //creating a copy of the request body and assign the image path to the img_url property to match DB
        currentPotionUpdate = { ...req.body, name : newName, img_url: req.file.path }
    } else {
        currentPotionUpdate = { ...req.body, name : newName }
    }
    try {
        const currentPotion = await Potion.findOne({ name: potionName })
        //Trying to find the new potion name already exist in DB
        const doesNewNameExist = await Potion.findOne({ name: currentPotionUpdate.name })
        if(doesNewNameExist){
            //Parsing the id into string so we can compare the id of the new and the old potion
            const potionId = "" + currentPotion._id
            const newPotionId = "" + doesNewNameExist._id
            //if it's a different id, that means the actual name exist on another potion, send error message in that case
            if (potionId !== newPotionId) {
                //Render the UPDATE page with error message
                res.render("potions-pages/update", {potion: currentPotion, loggedIn, errorMessage: "This potion name already exist" })
            }
        }
        //Find and update the potion, findByIdAndUpdate() promise will return the potion BEFORE being updated
        const myCurrentUpdated = await Potion.findByIdAndUpdate(currentPotion._id, currentPotionUpdate)
        //Refilter again to have the actual updated potion
        const myUpdatedPotion = await Potion.findById(currentPotion._id)
        res.redirect(`/potions/potion/${myUpdatedPotion.name}`)
    } catch (error) {
        console.error(error)
    }
})

//GET Delete my potion
router.get("/potion/:nameOfPotion/delete", isLoggedIn, async (req, res) => {
    loggedIn = true
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
        res.render('potions-pages/myFavorites', { myFavorites: myFavorites.favorites, loggedIn })
    } catch (error) {
        console.error(error)
    }
})

//GET added a potion to "Favorite" user's inventory
router.get("/potion/:nameOfPotion/favorite", isLoggedIn, async(req, res)=>{
    const potionName = req.params.nameOfPotion
    const currentUsername = req.session.user.username
    try {
        const findPotion = await Potion.findOne({name : potionName})
        const findUser = await User.findOne({username : currentUsername})
        //pushing the potion to the favorites array
        findUser.favorites.push(findPotion)
        //Need to use the "save()" function to save the changes into the databse
        await findUser.save()
        res.redirect(`/potions/potion/${potionName}/`)
    } catch (error) {
        console.error(error)
    }
})

//GET remove a potion from the "Favorite" user's inventory
router.get("/potion/:nameOfPotion/delete-favorite", isLoggedIn, async(req, res)=>{
    const potionName = req.params.nameOfPotion
    const currentUsername = req.session.user.username
    try {
        const findPotion = await Potion.findOne({name : potionName})
        const findUser = await User.findOne({username : currentUsername})
        //finding the potion index in the favorites array
        const potionIndex = findUser.favorites.indexOf(findPotion._id)
        //remove the potion using splice() from the favorites array
        findUser.favorites.splice(potionIndex, 1)
        //Need to use the "save()" function to save the changes into the databse
        await findUser.save()
        res.redirect(`/potions/potion/${potionName}/`)
    } catch (error) {
        console.error(error)
    }
})

module.exports = router;
