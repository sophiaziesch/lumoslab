// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv').config()

// ℹ️ Connects to the database
require('./db')

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express')

const app = express()
//SESSION require here
require('./config/session.config')(app);

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app)

// default value for title local
const capitalize = require('./utils/capitalize')
const projectName = 'lumoslab'

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`


// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes')
app.use('/', indexRoutes)


//Auth routes only when user is logged out
const authRoutes = require('./routes/auth.routes');
const { isLoggedOut } = require('./middleware/middleware');
app.use('/auth', isLoggedOut, authRoutes)

//Potions routes
const potionsRoutes = require('./routes/potions.routes');
const Potion = require('./models/Potion.model');
app.use('/potions', potionsRoutes)

//inserting all potions from API in the databse
const data = require("./allPotionsFromApi.json")
const allPotionsToDatabase = async()=>{
    try {
        await Potion.insertMany(data)
    } catch (error) {
        console.error(error)
    }
}
allPotionsToDatabase()


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app)

module.exports = app
