const express = require('express');
const Potion = require('../models/Potion.model');
const router = express.Router();

//route already set in app.js "/potions--"


//GET potions page
router.get('/', async (req, res) => {
    try {
        res.send("all potions here");
    } catch (error) {
        console.error(error);
    }

})

module.exports = router;
