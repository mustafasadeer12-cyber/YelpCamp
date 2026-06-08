const express = require('express')
const router = express.Router();
const passport = require('passport')
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const { storeReturnTo } = require('../middleware')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync( async(req, res, next) => {
    try {
    const { username, email, password} =  req.body
    const user = new User({email, username})
    const registeredUser =  await User.register(user, password)
    // console.log(registeredUser)
        req.login(registeredUser, err => { // to make user stay logged in after register, better experience
        if(err) return next()
        req.flash('success', 'Welcome to YelpCamp!')
        res.redirect('/campgrounds')
    })
    
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
    // res.send(req.body) //testing 
}))


router.get('/login', (req, res) => {
    res.render('users/login')
})


router.post('/login',storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    
    req.flash('success', `Welcome back to YelpCamp! ${req.user.username}`)
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo 
    res.redirect(redirectUrl)
})


// router.get('/logout', (req, res, next) => {
//     req.logout(function (err) {
//         if (err) {
//             return next(err);
//         }
//     })
//     req.flash('success', 'goodbye')
//     res.redirect('/campgrounds')
// })


router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 

module.exports = router;