require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const connectDB = require('./server/config/db')
connectDB()
// Other dependencies
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
//AJAX
const bodyParser = require('body-parser');


const app = express()
const PORT = 3000 || process.env.PORT
 
// Middlewares
app.use(express.static('public')) // sets public as root folder
app.use('/uploads', express.static('uploads')) // serve static files from the uploads directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI_DEV }), // USE MONGODB_URI_OFFICIAL FOR PRODUCTION
    cookie: {
        maxAge: null, // default cookie lifespan: 1 day in milliseconds, default val is null (deleted on broswer close)
        httpOnly: true,
        secure: true // Set to true for production/if using HTTPS (See also: login.ejs login form submission)
    }
}))
//AJAX Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

  
// Templating Engine
app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine','ejs')


app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/login'))

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`) // Fixed template literal syntax
})

