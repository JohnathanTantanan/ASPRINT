const { type } = require('express/lib/response')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PostSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    community:{
        type: String,
        required: true
    },
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
    upvotes:{
        type: Number,
        required: true
    },
    downvotes:{
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Post', PostSchema)