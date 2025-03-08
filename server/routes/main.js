const express = require('express')
const router = express.Router()
//const mongoose = require('mongoose');
//Server Model/Schema
const Post = require('../models/Post')
const Comments = require('../models/Comments')


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
        res.render('home', {locals, data}); // passing multiple variables as properties of an object
        // render takes two params (string, object)
    } catch (error) {
        console.log(error);
    }
    
});

/**GET /
 * POST PAGE
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
        res.render('post-page', {locals, data}); // should this be .toObject()? why
        // res.render('post-page', { locals, data: { ...data.toObject(), comments } });
    } catch (error) {
        console.log(error);
    }

    // Note: findById() can take in strings, but find() expects querys enclosed in {object literals}
});

/**GET /
 * COMMUNITIES PAGE
 */
router.get('/communities',(req,res)=>{
    res.render('communities', {
        layout: 'layouts/main',
        title: "The Forum",
        description: "Simple Blog created with NodeJs, Express & MongoDB."})
});

/**GET /
 * POPULAR PAGE
 */
router.get('/popular', async(req,res)=>{
    //var sorted = posts.sort((a, b) => b.upvotes - a.upvotes);
    const locals = {
        layout: 'layouts/main',
        title: "The Forum",
        description: "Simple Blog created with NodeJs, Express & MongoDB.",
    }

    try {
        const data = await Post.find({ upvotes: {$gt: 100} }).sort({ upvotes: -1 }); // compute upvote - downvote
        res.render('home', {locals, data});
        // res.render('popular', locals)
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;