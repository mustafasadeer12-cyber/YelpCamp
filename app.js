const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require ('method-override')
const Campground = require('./models/campground')
const session = require('express-session')
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user')


const userRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')


mongoose.connect('mongodb://127.0.0.1:27017/MoeYelpCamp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
 

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use(methodOverride('_method'))
app.use(express.urlencoded ({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(__dirname))



const sessionConfig = {
    secret: 'thisshouldnotbethesecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    console.log(req.session)
    res.locals.returnTo = req.session.returnTo
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error') 
    next()
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)


// 


app.get('/', (req, res) => {
    res.render('home')
   })



app.all('/{*path}', (req, res, next) => {
    // res.send('ERRRRRR')
    next(new ExpressError('Page not found', 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no!, something went wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(3000, () => {
    console.log('THIS IS PORT 3000')
   })


// app.get('/campgrounds/:id', async (req, res) => {
//     const campground = await Campground.findById(req.params.id)
//     res.render('campgrounds/show', { campground })

// })

// app.get('/fakeuser', async(req, res) => {
//     const user = new User ({email: 'mustasdsdsdsfa12@gmail',username:'must1212121afa' })
//     const newUser = await User.register(user, 'haha123')
//     res.send(newUser)
// })




