const User = require('../models/user')

module.exports.renderRegisterForm =  (req, res) => {
    res.render('users/register')
    // req.flash('error', 'Under maintenance, Registration is temporarily disabled')
    // return res.redirect('/campgrounds')
}


module.exports.register = async(req, res, next) => {
    // req.flash('error', 'Under maintenance')
    // return res.redirect('/campgrounds')
   
    try {
    const { username, email, password} =  req.body
    const user = new User({email, username})
    const registeredUser =  await User.register(user, password)
        req.login(registeredUser, err => { // to make user stay logged in after register, better experience
        if(err) return next()
        req.flash('success', 'Welcome to YelpCamp!')
        res.redirect('/campgrounds')
    })
    
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}


module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}


module.exports.login = (req, res) => {
    
    req.flash('success', `Welcome back to YelpCamp! ${req.user.username}`)
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo 
    res.redirect(redirectUrl)
}


module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
}