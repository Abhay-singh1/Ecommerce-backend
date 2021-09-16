const mongoose = require('mongoose')

const connectDB = async()=>{
    const connect = await mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        // useCreateIndex:true,
        // useFindAndModify:false,
        useUnifiedTopology:true
    })

    console.log(`Database connected successfully to ${connect.connection.host}!!!`)
}

module.exports = connectDB;