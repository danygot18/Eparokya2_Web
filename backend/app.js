const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')
const user = require('./routes/user')
const wedding = require('./routes/wedding')
const post = require('./routes/post')
const evenpost = require('./routes/EventPost')

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true}))
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: true }));
app.use(cookieParser());

// app.get('/order',(req, res) => {
//     res.send('GUMANA NAA')
// })
app.use('/api/v1', user);
app.use('/api/v1', wedding);
app.use('/api/v1', post);
app.use('/api/v1', evenpost);





module.exports = app