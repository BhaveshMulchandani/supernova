const express = require('express');
const app = express()
const cartRoutes = require('./routes/cart.routes');
const cokkieparser = require('cookie-parser');

app.use(express.json());
app.use(cokkieparser());
app.use('/api/cart', cartRoutes);


module.exports = app;