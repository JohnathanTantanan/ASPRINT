const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    images:{
        type: String,
        required: false
    },

    createAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },

})

module.exports = mongoose.model('Post', PostSchema)