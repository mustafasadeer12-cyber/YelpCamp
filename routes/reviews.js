const express = require('express')
const router = express.Router({ mergeParams: true})

const {reviewSchema} = require('../schemas')


const Review = require('../models/review')
const Campground = require('../models/campground')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const {isLoggedIn,validateReview } = require('../middleware')






router.post('/', isLoggedIn, validateReview, catchAsync( async (req, res) => { //Three Steps
const campground = await Campground.findById(req.params.id); // 1.extract id from req.params and store it
const review = new Review(req.body.review) // 2.make new review, using this from name="review[body]" in the show.ejs??! 
campground.reviews.push(review);  // 3.push the new review
await review.save();
await campground.save();
req.flash('success', 'Created new review!')
res.redirect(`/campgrounds/${campground._id}`)

}))


router.delete('/:reviewId',isLoggedIn, catchAsync( async (req, res) => {
    // 1. Exctract both IDs from the URL Params
    const {id, reviewId} = req.params; 
    
    // 2. Remove the review ID from the Campground's reviews array (Cleaning the parent)
    await Campground.findByIdAndUpdate(id , { $pull: { reviews: reviewId}}) 
    
    // 3. Delete the actual review document from the database (Killing the child)
    await Review.findByIdAndDelete(reviewId) 
    
    // 4. Redirect back to Campgrounds show page
    req.flash('success', 'You deleted a review!')
    res.redirect(`/campgrounds/${id}`) 
}))


module.exports = router;