const mongoose = require('mongoose')

const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trime:true,
        maxlength:200
    },
    
    description:{
        type:String,
        required:true,
        maxlength:2000,
    },

    price:{
        type:Number,
        required:true,
        trim:true,
        maxlength:32
    },
    category:{
        type:ObjectId,
        ref:"cats",
        required:true
    },
    quantity:{
        type:Number
    },
    sold:{
        type:Number,
        default :0
    },
    photo:{
        data:buffer,
        contentType:String
    },
    shipping:{
        type:Boolean
    }

},{
    timestamps:true
})

module.exports=mongoose.model("Products", productSchema)