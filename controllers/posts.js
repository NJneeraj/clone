const Post = require('../models/post');

module.exports.showPosts = async (req, res) => {
    const posts = await Post.find({}).populate('comments');
    res.render('home', { posts });
}