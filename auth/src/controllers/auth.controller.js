const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usermodel = require('../models/user.model');
const redis = require('../db/redis');

const registeruser = async (req, res) => {
    const { username, email, password, fullname: { firstname, lastname }, role } = req.body

    const isuseralreadyexist = await usermodel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if (isuseralreadyexist) {
        res.status(409).json({message:"user already exist"})
    }

    const hash = await bcrypt.hash(password,10)


    const user = await usermodel.create({
        username,
        email,
        password:hash,
        fullname:{firstname,lastname},
        role: role || 'user'
    })

    res.status(201).json({message:"user registered successfully",user})
}

const loginuser = async (req, res) => {
    const { username, email, password } = req.body

    const user = await usermodel.findOne({ $or: [{ email }, { username }] }).select('+password')

    if(!user){
        return res.status(401).json({message:'Invalid credentials'})
    }

    const ismatch = await bcrypt.compare(password, user.password)

    if(!ismatch){
        return res.status(401).json({message:'Invalid credentials'})
    }


    const token = jwt.sign({
        id:user._id,
        username:user.username,
        email:user.email,
        role:user.role
    },process.env.JWT_SECRET,{expiresIn:'1d'})

    res.cookie('token',token,{
        httpOnly:true,
        secure:true,
        maxAge:24*60*60*1000 //1 day
    })



    res.status(200).json({message:'Login successful',user})
}

const getcurrentuser = (req,res) =>{
    return res.status(200).json({message:'current user successfully fetched',user:req.user})
}

const logoutuser = async (req,res) =>{
    const token = req.cookies.token

    if(token){
        await redis.set(`blacklist:${token}`,true,'EX',24*60*60) //1 day
    }

    res.clearCookie('token',{
        httpOnly:true,
        secure:true,
    })

    return res.status(200).json({message:'Logout successful'})
}

const getuseraddress = async (req,res) =>{
    const id = req.user.id
    const user = await usermodel.findById(id).select('address')
    if(!user){
        return res.status(404).json({message:'User not found'})
    }
    return res.status(200).json({message:'User addresses fetched successfully',address:user.address})
}

const adduseraddress = async (req,res) => {
    const id =  req.user.id
    const {street,city,state,zip,country,isDefault} = req.body

    const user = await usermodel.findOneAndUpdate({_id:id},{
        $push:{
            address:{street,city,state,zip,country,isDefault}
        }
    },{new:true}) 

    if(!user){
        return res.status(404).json({message:'User not found'})
    }

    return res.status(200).json({message:'Address added successfully',address:user.address})
}

const deleteuseraddress = async (req,res) => {
    const id = req.user.id
    const {addressid} = req.params

    const isaddressexist = await usermodel.findOne({_id:id,'address._id':addressid})

    if(!isaddressexist){
        return res.status(404).json({message:'Address not found'})
    }
    
    const user = await usermodel.findOneAndUpdate({_id:id},{
        $pull:{
            address:{_id:addressid}
        }
    },{new:true})

    if(!user){
        return res.status(404).json({message:'User not found'})
    }

    const addressexists = user.address.some(addr => addr._id.toString() === addressid);

    if(addressexists){
        return res.status(404).json({message:'Address not deleted yet'})
    }

    return res.status(200).json({message:'Address deleted successfully',address:user.address})
}

module.exports = { registeruser, loginuser, getcurrentuser, logoutuser, getuseraddress, adduseraddress , deleteuseraddress };