const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const catchAsync = require('../utils/catchAsync');
const { validatePost, isLoggedIn, isAuthor } = require('../middleware');
const posts = require('../controllers/posts');

router.get('/',isLoggedIn, catchAsync(async (req, res) => {
    const posts = await Post.find({}).populate({
        path:'comments',
        populate:{
             path:'user'
            }
        })
        .populate('user');
    
    res.render('home', { posts });
}))

router.get('/new', isLoggedIn, (req, res, next) => {
    res.render('posts/newPost');
})

router.post('/', isLoggedIn, validatePost, catchAsync(async (req, res) => {
    const post = new Post(req.body.post);
    post.user = req.user._id;
    await post.save();
    console.log(post);
    res.redirect(`/posts/${post._id}`);
}))

router.get('/:id',isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    
    res.render('posts/show', { post });
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render('posts/edit', { post });

}))

router.put('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    await post.save();
    res.redirect(`/posts/${id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    res.redirect('/posts');
}))


module.exports = router;