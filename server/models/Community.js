const { type } = require('express/lib/response')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CommunitySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    banner: {
        type: String,
        required: false
    },
    picture:{
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    // moderators: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }],
    // members: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }],
    // rules: [{
    //     title: String,
    //     description: String
    // }],
    // postCount: {
    //     type: Number,
    //     default: 0
    // },
    // memberCount: {
    //     type: Number,
    //     default: 0
    // }
})

module.exports = mongoose.model('Community', CommunitySchema)