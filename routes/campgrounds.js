const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const {storeReturnTo ,isLoggedIn, validateCampground, isAuthor} = require('../middleware')






router.get('/',catchAsync( async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds})
}))


router.get('/new',isLoggedIn, (req, res) => {
    
    res.render('campgrounds/new')
})
 
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground')
    console.log('--- DEBUGGING BUG #1 ---');
    console.log('1. req.user object:', req.user);
    console.log('2. req.user._id exact value:', req.user._id);
    
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    
    console.log('3. Campground object BEFORE save:', campground);
    
    await campground.save();
    
    console.log('4. Campground object AFTER save:', campground);
    console.log('------------------------');

    req.flash('success', 'Successfully Made a New Camp!');
    res.redirect(`/campgrounds/${campground._id}`);
}));


router.get('/:id', isLoggedIn,catchAsync( async (req,res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author')
    console.log(campground)
    if(!campground) {
        req.flash('error','Cannot find Campground!')
       return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if(!campground) {
        req.flash('error','Cannot find Campground!')
       return res.redirect('/campgrounds')
    }
    
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id',isLoggedIn, isAuthor,validateCampground,catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'You have Successfully Updated a Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id',isLoggedIn, isAuthor,catchAsync( async (req, res) => {
   const { id } = req.params;
   await Campground.findByIdAndDelete(id)
   req.flash('success', 'Successfully deleted a campground!')
   res.redirect('/campgrounds')
}))


module.exports = router;