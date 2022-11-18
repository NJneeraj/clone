const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError');

const Post = require('./models/post');
const postRouer = require('./router/post');
const commentRouter = require('./router/comment');
const User = require('./models/user');
const userRouter = require('./router/user');


mongoose.connect("mongodb://localhost:27017/insta", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(flash());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/posts', postRouer);
app.use('/posts/:id/comments', commentRouter);
app.use('/user', userRouter);

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})


app.listen(5000, () => {
  console.log('Connected...');
})