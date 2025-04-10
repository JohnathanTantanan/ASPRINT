const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        // USE MONGODB_URI_OFFICIAL FOR PRODUCTION
        const conn = await mongoose.connect(process.env.MONGODB_URI_OFFICIAL)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    catch(err) {
        console.error(err)
    }
}

module.exports = connectDB