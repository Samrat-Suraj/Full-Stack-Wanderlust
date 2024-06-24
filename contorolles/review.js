const Review = require('../model/review.js');
const Listings = require('../model/listings.js');

module.exports.createReview = async (req, res) => {
    let listings = await Listings.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    console.log(newreview);
  
    listings.reviews.push(newreview);
    await newreview.save();
    await listings.save();
  
    req.flash('success' , 'Review Createad');
    res.redirect(`/listings/${listings.id}`);
}

module.exports.deleteReview = async(req,res)=>{
    let {id , reviewId} = req.params
  
    await Listings.findByIdAndUpdate(id , {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
  
    req.flash('success' , 'Review Deleted');
    res.redirect(`/listings/${id}`);
}