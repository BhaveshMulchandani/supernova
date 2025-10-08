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


module.exports = { createproduct }