const jwt = require('jsonwebtoken')

const createauthmiddleware = (roles = ["user"]) => {

    return function authmiddleware(req, res, next) {
        try {
            const token = req.cookies?.token ||  req.headers?.authorization?.split(" ")[1]

            if(!token){
                return res.status(401).json({message:'unauthorised:no token provided'})
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            if(!roles.includes(decoded.role)){
                return res.status(403).json({message:'forbidden:insufficient permissions'})
            }

            const user = decoded
            next()

        } catch (error) {
            return res.status(401).json({message:'unauthorised:invalid token'})
        }
    }
}

module.exports = createauthmiddleware