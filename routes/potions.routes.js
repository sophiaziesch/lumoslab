const express = require('express');
const { isLoggedIn } = require('../middleware/middleware');
const Potion = require('../models/Potion.model');
const router = express.Router();
const uploader = require('../config/cloudinary.config.js');

//route already set in app.js "/potions--"
//GET all potions page
router.get('/', async (req, res) => {
    try {
        res.send("all potions here");
    } catch (error) {
        console.error(error);
    }
})

//GET ONE potion page
router.get('/potion/:potionId', async(req,res)=>{
    const potionId = req.params.potionId
    try {
        const currentPotion = await Potion.findById(potionId)
        res.render("potions-pages/potion", {potion : currentPotion})
    } catch (error) {
        console.error(error)
    }
    
})

//GET create page only if you're logged in
router.get('/create', isLoggedIn, (req, res) => {
    res.render("potions-pages/create")
})

//POST create page
router.post('/create', uploader.single("img_url"), async (req, res) => {
    let aPotion
    
    //checking if user inserting an image, if not, the default one will be display
    if(req.file){
        //creating a copy of the request body and assign the image path to the img_url property to match DB
    aPotion = {...req.body, img_url : req.file.path}
    }else{
        aPotion = req.body
    }
    
    try {
    const newPotion = await Potion.create(aPotion)
    res.redirect(`/potions/potion/${newPotion._id}`)
    } catch (error) {
        console.error(error);
    }
})


module.exports = router;
