const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require('ejs-mate');

if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
console.log(process.env.SECRET)
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const passport = require("passport");
const LocalStatergy = require("passport-local");
const User = require("./models/user.js");

const session = require("express-session");
const flash = require("connect-flash");

require('./models/associations');
const listings = require('./routes/listing.js');
const Review = require('./routes/reviews.js');
const userRouter = require('./routes/user.js');
const categoriesRouter = require('./routes/categories.js');
const wishlistRoutes = require("./routes/wishlist");
const bookingRoutes = require('./routes/booking');

main().then(() => {
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');


}
app.listen(8080, () => {
    console.log("app is listening at 8080");
})

app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.user = req.user;
    res.locals.showAuthButtons = !req.isAuthenticated();
    res.locals.hideAuthButtons = false;
    res.locals.currentPath = req.path;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
app.use('/listing', listings);
app.use('/listing/:id/reviews', Review);
app.use('/', userRouter);
app.use('/', categoriesRouter);
app.use("/wishlist", wishlistRoutes);
app.use('/booking', bookingRoutes);
const notificationRoutes = require('./routes/navbar-data.js');
app.use('/', notificationRoutes);
const otpRoutes = require('./routes/otp'); 
app.use(otpRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("./listings/error.ejs", { error: err.message });
});
