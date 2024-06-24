const express = require('express');
const router = express.Router({mergeParams : true});
const warpAsync = require('../utils/wrapAsync.js');
const {validateReview ,isreviewAuthor, isLogin} = require('../midlewarelogin.js');
const {createReview , deleteReview} = require('../contorolles/review.js')


// Review Postroute
router.post('/',isLogin, validateReview ,warpAsync(createReview));
// Review Delete route
router.delete('/:reviewId' ,isLogin, isreviewAuthor ,warpAsync(deleteReview))

module.exports = router;
  