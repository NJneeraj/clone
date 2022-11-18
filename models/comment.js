const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const commentSchema=new Schema({
    user:String,
    content:{
      type:String,
      required:true  
    },
    post:{
        type:Schema.Types.ObjectId,
        ref:'Post'
    }
})

module.exports=mongoose.model('Comment',commentSchema);