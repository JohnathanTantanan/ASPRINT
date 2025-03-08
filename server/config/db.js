const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        // use MONGODB_URI_DEFAULT for testing, finalized DB is MONGODB_URI
        const conn = await mongoose.connect(process.env.MONGODB_URI_DEFAULT)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    catch(err) {
        console.error(err)
    }
}

module.exports = connectDB