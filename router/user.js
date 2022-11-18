const express=require('express');
const router=express.Router();
const passport=require('passport');
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');

router.get('/signup',(req,res)=>{
    res.render('user/signUp');
})

router.post('/signup',catchAsync(async (req,res)=>{
    try {
        const {email,username,password}=req.body;
        const  user=new User({email,username});
        const registeredUser=await User.register(user,password);

        res.redirect('/posts');

    } catch (err) {
        console.error(err.message);
    }
}))

router.get('/signin',catchAsync(async (req,res)=>{
    res.render('user/signIn')
}))


router.post('/signin',catchAsync(async (req,res)=>{
    res.send('Posted');
}))
module.exports=router;