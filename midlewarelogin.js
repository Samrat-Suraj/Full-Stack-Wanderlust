const Listings = require('./model/listings.js');
const Review = require('./model/review.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingsSchema , reviewSchema} = require('./Schema.js');

module.exports.isLogin = (req, res, next) => {
    // console.log(req.user);
    // console.log(req.path , req.originalUrl)
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in.');
        return res.redirect('/login');
    }
    next();
};


module.exports.saveRedirectUrl = (req ,res ,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner =async (req ,res ,next)=>{
    let { id } = req.params;
    let listing = await Listings.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash('error' , 'You Dont Have Permisssion To Edit');
      return res.redirect(`/listings/${id}`);
    }
    next()
}

// -----------validateListings------------

module.exports.validatelisting = (req, res, next) => {
    let { error } = listingsSchema.validate(req.body);
    if (error) {
      let errormessage = error.details.map((el) => el.message).join(',');
      throw new ExpressError(400, errormessage);
    } else {
      next();
    }
};

// -----------validateReview------------

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errormessage = error.details.map((el) => el.message).join(',');
      throw new ExpressError(400, errormessage);
    } else {
      next();
    }
};

module.exports.isreviewAuthor =async (req ,res ,next)=>{
  let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash('error' , 'You Dont Have Permisssion To Delete This Review');
    return res.redirect(`/listings/${id}`);
  }
  next()
}