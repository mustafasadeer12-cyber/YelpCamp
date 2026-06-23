const User = require('../models/user')

module.exports.renderRegisterForm =  (req, res) => {
    res.render('users/register')
}


module.exports.register = async(req, res, next) => {
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