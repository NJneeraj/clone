const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');

const postSchema = new Schema({
    location: String,
    url: String,
    description: String,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

postSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Post', postSchema);