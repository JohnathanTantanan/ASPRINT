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
    },
    // upvotes: {
    //     type: Number,
    //     default: 0
    // },
    // downvotes: {
    //     type: Number,
    //     default: 0
    // },
    // voters: [{
    //     user: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'User'
    //     },
    //     voteType: {
    //         type: String,
    //         enum: ['upvote', 'downvote']
    //     }
    // }]
})

module.exports = mongoose.model('Comments', CommentSchema)