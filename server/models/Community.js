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
    }
})

module.exports = mongoose.model('Community', CommunitySchema)