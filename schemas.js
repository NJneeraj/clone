const Joi=require('joi');

module.exports.postSchema=Joi.object({
    post:Joi.object({
        title:Joi.string().required(),
        url:Joi.string().required(),
        description:Joi.string().required()
    }).required()
});

module.exports.commentSchema=Joi.object({
    comment:Joi.object({
        content:Joi.string().required()
    })
})