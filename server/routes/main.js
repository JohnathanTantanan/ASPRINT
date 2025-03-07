const express = require('express')
const router = express.Router()
const dataModule = require('../../data')
//Server Model/Schema
const Post = require('../models/Post')
const PostComments = require('../models/PostComments')


/**GET /
 * HOME
 */
router.get(['', '/home'], async (req,res)=>{
    const locals = { 
        layout: 'layouts/main',
        title: "The Forum",
        description: "Simple Blog created with NodeJs, Express & MongoDB."
    }

    try {
        const data = await Post.find().populate('username');
        res.render('home', {locals, data});
    } catch (error) {
        console.log(error);
    }
    
});

/**GET /
 * POST PAGE
 */
router.get('/post/:id/:title', async (req, res) => {
    const locals = {
        layout: 'layouts/main',
        title: req.params.title
    };

    try {
        const data = await Post.findById(req.params.id).populate('username').populate('comments');
        res.render('post-page', {locals, data});
    } catch (error) {
        console.log(error);
    }
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