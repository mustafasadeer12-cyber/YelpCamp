if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({ quiet: true})
}



const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require ('method-override')
const Campground = require('./models/campground')

const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user')



const helmet = require('helmet')

const userRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')

const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session')
const { MongoStore } = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/MoeYelpCamp'
// mongoose.connect(dbUrl);


// const dbLocal = 'mongodb://127.0.0.1:27017/MoeYelpCamp'

mongoose.connect(dbUrl);


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
app.use(mongoSanitize())


// app.use(helmet({
//     contentSecurityPolicy: false
//   }),
// );


app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];

 imgSrc: [
                // all your other existing code
                
                // add this:
                "https://api.maptiler.com/",
            ];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dt4dettlr/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'


const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});


const sessionConfig = {
    store,
    name:'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, // we use this only in PRODUCTION. HTTPS.
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
    // console.log(req.session)
    // console.log(req.query)
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Full Error Object:', err);
    console.error('Error Message:', err.message || 'No message');
    console.error('Error Stack:', err.stack);
    const { statusCode = 500 } = err;
    res.status(statusCode).render('error', { err })
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`This is port ${port}`)
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




