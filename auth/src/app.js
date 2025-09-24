const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const authroutes = require('./routes/auth.routes')

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authroutes);



module.exports = app;