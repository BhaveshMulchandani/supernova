const jwt = require('jsonwebtoken')

const authmiddleware = (req,res,next) =>{
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message:'Unauthorized'})
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = decoded
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({message:'Unauthorized'})
    }
}

module.exports = authmiddleware