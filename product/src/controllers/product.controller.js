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

const getproductsbyid = async (req,res)=>{
    const {id} = req.params

    const product = await productmodel.findById(id)

    if(!product){
        return res.status(404).json({message:"product not found"})
    }

    return res.status(200).json({message:"Product fetched successfully",product })


}

const updateproduct = async (req,res) => {
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isvalid(id)){
        return res.status(400).json({message:"Invalid product ID"})
    }

    const product = await productmodel.findOne({_id:id})

    if(!product){
        return res.status(404).json({message:"Product not found"})
    }

    if(product.seller.toString() !== req.user.id){
        return res.status(403).json({message:"You are not authorized to update this product"})
    }

    const allowedupdates = ['title', 'description', 'price'];

    for (const key of Object.keys(req.body)){
        if (allowedupdates.includes(key)) {
            if(key === 'price' && typeof req.body.price === 'object') {
                product.price.amount = Number(req.body.price.amount)
            }
            if(req.body.price.currency !== undefined){
                product.price.currency = req.body.price.currency
            }
        }else{
            product[key] = req.body[key]
        }
    }

    await product.save()

    return res.status(200).json({message:"Product updated successfully",product})
}

const deleteproduct = async (req,res) => {

    const {id} = req.params

    if(!mongoose.Types.ObjectId.isvalid(id)){
        return res.status(400).json({message:"Invalid product ID"})
    }

    const product = await productmodel.findOne({_id:id})

    if(!product){
        return res.status(404).json({message:"Product not found"})
    }

    if(product.seller.toString() !== req.user.id){
        return res.status(403).json({message:"You are not authorized to delete this product"})
    }

    await productmodel.findOneAndDelete({_id:id})

    return res.status(200).json({message:"Product deleted successfully"})




}

const getproductsbyseller = async (req,res) => {
    const seller = req.user.id

    const {skip=0,limit=20} = req.query;

    const products = await productmodel.find({seller:seller.id}).skip(skip).limit(Math.min(Number(limit, 20)))

    return res.status(200).json({message:"Products fetched successfully",products})



}

module.exports = { createproduct, getproducts, getproductsbyid, updateproduct, deleteproduct, getproductsbyseller }