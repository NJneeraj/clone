const express=require('express');
const router=express.Router();
const Post=require('../models/post');
const catchAsync=require('../utils/catchAsync');
const {validatePost}=require('../middleware');

router.get('/',catchAsync(async (req,res)=>{
    const posts=await Post.find({}).populate('comments');
    res.render('home',{posts});
}))

router.get('/new',(req,res,next)=>{
    res.render('posts/newPost');
})

router.post('/',validatePost,catchAsync(async (req,res)=>{
        const post= new Post(req.body.post);
       await post.save();
       console.log(post);
       res.redirect(`/posts/${post._id}`);
}))

router.get('/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    const post= await Post.findById(id);
    res.render('posts/show',{post});
}))

router.get('/:id/edit',catchAsync(async (req,res)=>{
    const {id}= req.params;
    const post= await Post.findById(id);
    res.render('posts/edit',{post});
   
}))

router.put('/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    const post= await Post.findByIdAndUpdate(id,{...req.body.post});
    await post.save();
    res.redirect(`/posts/${id}`);
}))

router.delete('/:id',catchAsync(async (req,res)=>{
   const {id}=req.params;
   const post=await Post.findByIdAndDelete(id);
   res.redirect('/posts');
}))


module.exports=router;