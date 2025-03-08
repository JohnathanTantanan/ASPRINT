const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
//const mongoose = require('mongoose');


//Server Models/Schemas
const Post = require('../models/Post')
const Comments = require('../models/Comments')

const getUser = async (req) => {
    try {
        const token = req.cookies.token;
        if (!token) return null;
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        return user;
    } catch (error) {
        return null;
    }
}

/**GET /
 * HOME
 */
// [] is used to define multiple route definitions
router.get(['', '/home'], async (req,res)=>{
    const locals = { 
        layout: 'layouts/main',
        title: "The Forum",
        description: "Simple Blog created with NodeJs, Express & MongoDB."
    }

    try {
        const data = await Post.find().populate('poster');
        const user = await getUser(req);
        res.render('home', {locals, data, user}); 
    } catch (error) {
        console.log(error);
    }
    
});

/**GET /
 * A POST's PAGE
 */
// Placeholders in route definitions
router.get('/post/:id/:title', async (req, res) => {
    const locals = {
        layout: 'layouts/main',
        title: req.params.title
    };

    try {
        //const postId = new mongoose.Types.ObjectId(req.params.id);
        const data = await Post.findById(req.params.id).populate('poster'); // returns a single mongoose document 
        const comments = await Comments.find({ postId: req.params.id }).populate('commenter'); // returns array of mongoose documents 
        data.comments = comments; // manual population
        res.render('post-page', {locals, data}); // should this be data.toObject()? why
    } catch (error) {
        console.log(error);
    }

    // Note: findById() can take in strings, but find() expects querys enclosed in {object literals}
});

/**GET /
 * COMMUNITIES PAGE
 */
router.get('/communities', async (req,res)=>{
    const locals = {
        layout: 'layouts/main',
        title: "Communities",
        description: "Simple Blog created with NodeJs, Express & MongoDB."
    }
    try {
        const user = await getUser(req);
        res.render('communities', { locals, user });
    } catch (error) {
        console.log(error);
    }
});

/**GET /
 * POPULAR PAGE
 */
router.get('/popular', async(req,res)=>{
    const locals = {
        layout: 'layouts/main',
        title: "Popular",
        description: "Simple Blog created with NodeJs, Express & MongoDB.",
    }

    try {
        const data = await Post.find({ upvotes: {$gt: 100} })
            .sort({ upvotes: -1 })
            .populate('poster');
        const user = await getUser(req);
        res.render('home', {locals, data, user});
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;