const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError=require('./utils/expressError');

const Post = require('./models/post');
const postRouer = require('./router/post');
const post = require('./models/post');
const commentRouter=require('./router/comment');


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
app.use('/posts', postRouer);
app.use('/posts/:id/comments',commentRouter);

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