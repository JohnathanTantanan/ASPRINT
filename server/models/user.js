const { type } = require('express/lib/response')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    picture:{
        type: String,
        required: false
    },
    description:{
        type: String,
        required: false
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
})

module.exports = mongoose.model('User', UserSchema)