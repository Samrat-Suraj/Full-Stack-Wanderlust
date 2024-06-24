const Listings = require('../model/listings.js');
const mbxGerocoading = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =  process.env.MAP_TOKEN;

const geocodingClient = mbxGerocoading({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    let listings = await Listings.find({});
    res.render('listings/index.ejs', { listings });
}

module.exports.rendernewform = async (req, res) => {
    res.render('listings/new.ejs');
}

module.exports.showListings =async (req, res) => {
    let { id } = req.params;
    let listings = await Listings.findById(id).populate({path : 'reviews' , populate :{path : 'author'}}).populate('owner');
    if(!listings){
      req.flash('error' , 'Listings Does Not Exist');
      res.redirect('/listings')
    }
    console.log(listings)
    res.render('listings/show.ejs', { listings });
}

module.exports.createListings = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()


    let url = req.file.path;
    let filename = req.file.filename;

    let listing = new Listings(req.body.listing);
    listing.owner = req.user._id;
    listing.image = {url , filename}
    listing.geometry = response.body.features[0].geometry;

    let savelistings = await listing.save();
    console.log(savelistings);

    req.flash('success' , 'new Listings Created');
    res.redirect('/listings');
}

module.exports.randerEditform = async (req, res) => {
    let { id } = req.params;
    let listing = await Listings.findById(id);
    
    if(!listing){
      req.flash('error' , 'Listings Does Not Exist');
      res.redirect('/listings')
    }

    let originalUrl = listing.image.url;
    originalUrl=originalUrl.replace('/upload' , '/upload/h_100');

    res.render('listings/edit.ejs', { listing ,originalUrl});
}

module.exports.updateListings = async (req, res) => {
    let { id } = req.params;

    let listing = await Listings.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename}
        await listing.save()
    }
    req.flash('success' , 'Listings Updated');
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListings = async (req, res) => {
    let { id } = req.params;
    let listing = await Listings.findByIdAndDelete(id);
    req.flash('success' , 'Listings Deleted');
    res.redirect(`/listings`);
}