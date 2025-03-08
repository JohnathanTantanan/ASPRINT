const { type } = require('express/lib/response')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CommentSchema = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    commenter:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    comment: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Comments', CommentSchema)