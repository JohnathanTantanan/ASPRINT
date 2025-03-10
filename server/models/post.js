const { type } = require('express/lib/response')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PostSchema = new Schema({
    poster:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: false
    },
    community:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    images:{
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    createdAt:{
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
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }]
})

module.exports = mongoose.model('Post', PostSchema)