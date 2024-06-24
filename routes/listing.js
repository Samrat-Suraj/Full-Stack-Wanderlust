const express = require('express');
const router = express.Router();
const warpAsync = require('../utils/wrapAsync.js');
const {isLogin , isOwner , validatelisting} = require('../midlewarelogin.js');
const {index ,rendernewform ,showListings ,createListings ,randerEditform ,updateListings ,deleteListings} = require('../contorolles/listings.js');
const multer  = require('multer')

const {storage} = require('../cloudeConfig.js');
const upload = multer({storage})

router.route('/')
.post(isLogin,upload.single('listing[image]'),validatelisting,warpAsync(createListings))
.get(warpAsync(index))

// ---------New Route-----------
router.get('/new',isLogin,rendernewform);

router.route('/:id')
.get(warpAsync(showListings))
.patch(isLogin,isOwner,upload.single('listing[image]'),validatelisting, warpAsync(updateListings))
.delete(isLogin,isOwner, warpAsync(deleteListings))


router.get('/:id/edit',isLogin ,isOwner,warpAsync(randerEditform));
  

module.exports = router;