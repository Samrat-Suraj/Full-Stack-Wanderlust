if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user");
const Listings = require("./model/listings.js");
const MongoStore = require("connect-mongo");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", engine);

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouters = require("./routes/user.js");

const MONGO_URL = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("Connected To Database");
  })
  .catch((err) => console.log("Error Found", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in Mongosession Store", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/listings/search", async (req, res) => {
  const key = req.query.key;
  const data = await Listings.find({
    $or: [
      { title: { $regex: key, $options: "i" } },
      { location: { $regex: key, $options: "i" } },
      { country: { $regex: key, $options: "i" } },
    ],
  });
  res.render("listings/search.ejs", { data });
});

// ----------------Search----------------

app.post("/listings/search", async (req, res) => {
  const key = req.body.search;
  const data = await Listings.find({
    $or: [
      { title: { $regex: key, $options: "i" } },
      { location: { $regex: key, $options: "i" } },
      { country: { $regex: key, $options: "i" } },
    ],
  });
  res.render("listings/search.ejs", { data });
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouters);

// ------Middleware Error Handler-------

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong" } = err;
  res.status(status).render("Error.ejs", { message });
});

// ----------Start Server---------------

app.listen(8080, () => {
  console.log("App Listening On Port", 8080);
});
