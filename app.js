//libs
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

//middleware
const conDb = require('./config/data.js')

const app = express()

app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())
require('dotenv').config({
    path:'./config/index.env'
})

conDb();

app.use('/api/users/', require('./routes/auth.js'))
app.use('/api/category/', require('./routes/cats.js'))

app.get('/',(req,res) => {
    res.send("This is the homepage of my website!!!")
})

const api = process.env.API_URL
const Port  = process.env.PORT
app.listen(Port,()=>{
    console.log(`Server listening on ${Port}!`)
})
