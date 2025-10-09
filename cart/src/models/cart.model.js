const mongoose = require('mongoose');

const Cartschema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    items:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
                min:1,
            },
        },
    ]
},{timestamps:true})

const cartmodel = mongoose.model('cart', Cartschema);
module.exports = cartmodel;