const mongoose = require('mongoose');

const Addressschema = new mongoose.Schema({
    street:String,
    city:String,
    state:String,
    zip:String,
    country:String,
    isDefault:{type:Boolean,default:false}
})

const Userschema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        select:false
    },
    fullname: {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true }
    },
    role: {
        type: String,
        enum: ['user', 'seller'],
        default: 'user'
    },

    address: [Addressschema]
})

const usermodel = mongoose.model('user', Userschema);
module.exports = usermodel;