const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
<<<<<<< HEAD
  console.log("hello")
=======
  console.log('blabla')
>>>>>>> 54a631f (pushing in main)
  res.render("index");
});

module.exports = router;
