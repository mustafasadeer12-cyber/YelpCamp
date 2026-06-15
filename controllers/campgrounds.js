const Campground = require('../models/campground')


module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds})
}


module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}


module.exports.createNewCampground = async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground')
    // console.log('--- DEBUGGING BUG #1 ---');
    // console.log('1. req.user object:', req.user);
    // console.log('2. req.user._id exact value:', req.user._id);
   
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    
    // console.log('3. Campground object BEFORE save:', campground);
    
    await campground.save();
    
    // console.log('4. Campground object AFTER save:', campground);
    // console.log('------------------------');

    req.flash('success', 'Successfully Made a New Camp!');
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if(!campground) {
        req.flash('error','Cannot find Campground!')
       return res.redirect('/campgrounds')
    }
    
    res.render('campgrounds/edit', { campground })
}


module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'You have Successfully Updated a Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
   const { id } = req.params;
   await Campground.findByIdAndDelete(id)
   req.flash('success', 'Successfully deleted a campground!')
   res.redirect('/campgrounds')
}