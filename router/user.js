const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn}=require('../middleware');

router.get('/signup', (req, res) => {
    res.render('user/signUp');
})

router.post('/signup', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        user.profilePic='';
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })

        res.redirect('/posts');

    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/user/signup');
    }
}))

router.get('/signin', catchAsync(async (req, res) => {
    res.render('user/signIn')
}))

router.get('/profile',isLoggedIn,catchAsync(async (req,res)=>{
    const user=req.user;
    res.render('user/profile',{user});
}))

router.post('/profile',isLoggedIn,catchAsync(async (req,res)=>{
    const img=req.body.image;
    const user=await User.findByIdAndUpdate(req.user._id,{profilePic:img});
    await user.save();
    console.log(user);
    res.redirect('/posts');
}))


router.post('/signin', passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/signin' }), catchAsync(async (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/posts';
    delete req.session.returnTo;
    res.redirect(redirectUrl);


}))

router.get('/signout',async(req,res)=>{
    req.logout(function(err){
        if(err) next(err);
        req.flash('success', "Goodbye!");
    })
    res.redirect('/user/signin');
})

module.exports = router;