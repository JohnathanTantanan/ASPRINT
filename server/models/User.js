const { type } = require('express/lib/response')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // This will auto-update the updatedAt field
})

module.exports = mongoose.model('User', UserSchema)