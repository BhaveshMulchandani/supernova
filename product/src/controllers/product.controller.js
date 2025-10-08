const productmodel = require('../models/product.model')
const { uploadImage } = require('../services/imagekit.service')

const createproduct = async (req, res) => {
    try {

        const {title,description,priceamount,pricecurrency='INR'} = req.body

        if(!title || !priceamount){
            return res.status(400).json({message:"Title and Price Amount are required"})
        }

        const seller = req.user.id

        const price = {
            amount: Number(priceamount),
            currency: pricecurrency
        }

        const images = await Promise.all((req.files || []).map(file => uploadImage({buffer:file.buffer})))

        const product = await productmodel.create({title,description,price,seller,images})
        return res.status(201).json({message:"Product Created Successfully",product})
        
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error",error:error.message})
    }

}

const getproducts = async (req,res)=>{
    const {q,minprice,maxprice,skip=0,limit=20} = req.query;

    const filter = {}

    if(q){
        filter.$text = {$search: q}
    }

    if(minprice){
        filter['price.amount'] = {...filter['price.amount'],$gte: Number(minprice)}
    }

    if(maxprice){
        filter['price.amount'] = {...filter['price.amount'],$lte: Number(maxprice)}
    }

    const products = await productmodel.find(filter).skip(Number(skip)).limit(Math.min(Number(limit), 20)).sort({createdAt:-1})

    return res.status(200).json({message:"Products fetched successfully",products})



}


module.exports = { createproduct, getproducts }