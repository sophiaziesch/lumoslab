const express = require('express');
const { isLoggedIn } = require('../middleware/middleware');
const Potion = require('../models/Potion.model');
const User = require('../models/User.model');
const router = express.Router();

//Cloudinary middleware
const uploader = require('../config/cloudinary.config.js');

//route already set in app.js "/potions--"
//GET all potions page
router.get('/', async (req, res) => {
    try {
        const allPotions = await Potion.find()
        res.render("potions-pages/allPotions", {allPotions})
    } catch (error) {
        console.error(error);
    }
})

//GET ONE potion page
router.get('/potion/:potionId', async (req, res) => {
    const potionId = req.params.potionId
    try {
        const currentPotion = await Potion.findById(potionId)
        res.render("potions-pages/potion", { potion: currentPotion })
    } catch (error) {
        console.error(error)
    }
})

//GET create page only if you're logged in
router.get('/create', isLoggedIn, (req, res) => {
    res.render("potions-pages/create")
})

//POST create page using CLOUDINARY as a middleware
router.post('/create', uploader.single("img_url"), async (req, res) => {
    let aPotion
    const currentInventor = req.session.user.username
    //checking if user inserting an image, if not, the default one will be display
    if (req.file) {
        //creating a copy of the request body and assign the image path to the img_url property to match DB
        aPotion = { ...req.body, img_url: req.file.path, inventor: currentInventor}
    } else {
        aPotion = { ...req.body, inventor: currentInventor}
    }
    try {
        const newPotion = await Potion.create(aPotion)
        //find all potions of current user
        const myPotions = await Potion.find({inventor : currentInventor})
        //update the current user potions inventory
        await User.findOneAndUpdate({username : currentInventor},{potions : myPotions} )
        res.redirect(`/potions/potion/${newPotion._id}`)
    } catch (error) {
        console.error(error);
    }
})

//GET MyPotion page
router.get('/my-potions', async(req, res)=>{
    const currentUsername = req.session.user.username
try {
    const myPotions = await User.findOne({username : currentUsername}).populate("potions")
    res.render('potions-pages/myPotions', {myPotions : myPotions.potions})
} catch (error) {
    console.error(error)
}
})


module.exports = router;
