const cartmodel =  require('../models/cart.model');


const additemtocart = async (req,res) =>{

    const {productId,quantity} = req.body;
    const user = req.user

    let cart = await cartmodel.findOne({user:user._id});

    if(!cart){
        cart = new cartmodel({user:user._id, items:[]})
    }

    const existingitemindex = cart.items.findIndex(item => item.productId.toString() === productId);

    if(existingitemindex >= 0){
        cart.items[existingitemindex].quantity += quantity;
    }else{
        cart.items.push({productId, quantity});
    }

    await cart.save();
    res.status(200).json({message:'Item added to cart successfully',cart});
}

const updateitemquantity = async (req,res) => {
     const { productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const cart = await cartmodel.findOne({ user: user.id });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingItemIndex < 0) {
        return res.status(404).json({ message: 'Item not found' });
    }
    cart.items[ existingItemIndex ].quantity = quantity;
    await cart.save();
    res.status(200).json({ message: 'Item updated', cart });
}

const getcart = async (req,res) => {

    const user = req.user

    let cart = await cartmodel.findOne({user:user._id})

    if(!cart){
        cart = new cartmodel({user:user._id, items:[]})
        await cart.save();
    }

    res.status(200).json({cart,totals:{
        itemcount:cart.items.length,
        totalquantity:cart.items.reduce((sum,item)=>sum+item.quantity)
    }})

}

module.exports = {additemtocart, updateitemquantity, getcart}