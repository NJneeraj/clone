const express = require('express');
const router = express.Router({ mergeParams: true });
const Comment = require('../models/comment');
const Post = require('../models/post');
const catchAsync = require('../utils/catchAsync');
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware');


router.post('/', validateComment, isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  const comment = new Comment(req.body.comment);
  post.comments.push(comment);
  await comment.save();
  await post.save();
  res.redirect(`/posts`);

}))

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(async (req, res) => {
  const { id, commentId } = req.params;
  await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  res.redirect('/posts');
}))

module.exports = router;