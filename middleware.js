const { postSchema, commentSchema } = require('./schemas');
const Post = require('./models/post');
const Comment = require('./models/comment');
const ExpressError = require('./utils/expressError');

module.exports.validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/user/signin');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized!');
        return res.redirect(`/posts`);
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized!');
        return res.redirect('/posts');
    }
    next();
}