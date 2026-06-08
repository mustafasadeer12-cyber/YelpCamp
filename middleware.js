const ExpressError = require('./utils/ExpressError')
const {campgroundSchema, reviewSchema} = require('./schemas')
const Campground = require('./models/campground')


module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params 
    const campground = await Campground.findById(id)
if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You don not have permission to do this')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}


module.exports.storeReturnTo = (req, res, next) => {
    if(req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next()
}


module.exports.isLoggedIn = (req,res, next) => {
    console.log('REQ.USER...', req.user)
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
            req.flash('error', 'you must sign in')
            return res.redirect('/login') 
        } //I could use else res.redirect instead of using return, both works!
    next();
}

module.exports.validateCampground = (req, res, next) => { 
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body || {});
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
