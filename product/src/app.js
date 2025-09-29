const express = require('express')
const cookieparser = require('cookie-parser')
const app = express()
const productroutes = require('./routes/product.routes')

app.use(express.json())
app.use(cookieparser())

app.use('/api/products', productroutes)




module.exports = app