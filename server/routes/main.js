const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
//const mongoose = require('mongoose');


//Server Models/Schemas 
const Post = require('../models/Post')
const Comments = require('../models/Comments')
const Community = require('../models/Community')

// Show username when LoggedIn
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

// UPVOTES AND DOWNVOTES
router.post('/post/upvote/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        post.upvotes += 1;
        await post.save();
        res.json({ success: true, upvotes: post.upvotes });
    } catch (error) {
        console.error('Error upvoting post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**GET /
 * HOME
 */
// [] is used to define multiple route definitions
router.get(['', '/home'], async (req,res)=>{
    const locals = { 
        layout: 'layouts/main',
        inCommunity: false,
        title: "The Forum",
        description: "Simple Blog created with NodeJs, Express & MongoDB."
    }

    try {
        const data = await Post.find()
            .populate('poster')
            .populate('community')
            .sort({ createdAt: -1 });
        const user = await getUser(req);
        const communities = await Community.find();
        res.render('home', {
            locals, 
            data, 
            user,
            communities
        });  
    } catch (error) {
        console.log(error);
    }
    
});

/**GET /
 * CREATE POST PAGE
 */
router.get('/createpost', async (req,res)=>{
    const locals = {
        layout: 'layouts/main',
        title: "Create Post",
        description: "Simple Blog created with NodeJs, Express & MongoDB."
    }

    try {
        const user = await getUser(req);
        const communities = await Community.find();
        res.render('createpost', {locals, user, communities});
    } catch (error) {
        console.log(error);
    }
});

/**GET /
 * A POST'S DEDICATED PAGE
 */
// Placeholders in route definitions
router.get('/post/:id/:title', async (req, res) => {
    const locals = {
        layout: 'layouts/main',
        title: req.params.title
    };

    try {
        //const postId = new mongoose.Types.ObjectId(req.params.id);
        const user = await getUser(req);
        const data = await Post.findById(req.params.id).populate('poster'); // returns a single mongoose document 
        const comments = await Comments.find({ postId: req.params.id })
            .sort({ createdAt: -1 })
            .populate('commenter'); // returns array of mongoose documents 
        data.comments = comments; // manual population
        const communities = await Community.find();
        res.render('post-page', {locals, data, user, communities}); // should this be data.toObject()? why
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
        const communities = await Community.find();
        res.render('communities', { locals, user, communities });
    } catch (error) {
        console.log(error);
    }
});

/**GET /
 * A COMMUNITY'S DEDICATED PAGE
 */
router.get('/c/:id/:name', async (req,res)=>{
    const locals = {
        layout: 'layouts/main',
        title: req.params.name,
        inCommunity: true
    };

    try {
        //const postId = new mongoose.Types.ObjectId(req.params.id);
        const user = await getUser(req);
        const community = await Community.findById(req.params.id);
        const data = await Post.find({ community: req.params.id}).populate('poster');
        const comments = await Comments.find({ postId: req.params.id }).populate('commenter');
        data.comments = comments; // manual population
        const communities = await Community.find();
        res.render('home', {locals, data, user, community, communities});
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
        const communities = await Community.find();
        const data = await Post.find({ upvotes: {$gt: 100} })
            .sort({ upvotes: -1 })
            .populate('poster')
            .populate('community');
        const user = await getUser(req);
        res.render('home', {
            locals, 
            data, 
            user,
            communities
        });
    } catch (error) {
        console.log(error);
    }
});
 
/**POST /
 * POST SUBMISSION AND CREATION
 */
router.post('/submit-post', async (req, res) => {
    try {
        const user = await getUser(req);
        if (!user) {
            return res.redirect('/login');
        }

        const { title, content, community } = req.body; // extract data submitted

        const post = await Post.create({
            poster: user._id,
            community: community, // community is already the ObjectId from the form
            title,
            content,
            upvotes: 0,
            downvotes: 0
        });

        const encodedTitle = encodeURIComponent(post.title) // encode special characters
        res.redirect(`/post/${post._id}/${encodedTitle}`);
    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).send('Error creating post');
    }
});

/**POST /
 * UPDATE POST
 */
router.post('/update-post/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const postId = req.params.id;

        const updatedPost = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });

        const encodedTitle = encodeURIComponent(updatedPost.title); // encode special characters
        res.redirect(`/post/${updatedPost._id}/${encodedTitle}`);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**POST /
 * UPDATE COMMENT
 */
router.post('/update-comment/:id', async (req, res) => {
    try {
        const { comment } = req.body;
        const commentId = req.params.id;

        const updatedComment = await Comments.findByIdAndUpdate(commentId, { comment }, { new: true });

        res.redirect('back');
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**GET /
 * GET SEARCH TERM
 */
router.get('/search', async (req,res)=>{

    // FOR GET METHOD
    try {
        const locals = {
            layout: 'layouts/main',
            title: "Search - The Forum",
            inCommunity: false
        };

        let searchTerm = req.query.searchTerm; // Use req.query for GET requests
        const searchInsensitive = searchTerm.replace(/[^a-zA-Z0-9]/g, ""); // Sanitize search term

        const query = {
            $or: [
                { title: {$regex: new RegExp(searchInsensitive, 'i')}},
                { content: {$regex: new RegExp(searchInsensitive, 'i')}}
            ]
        } // Case-insensitive search
        const data = await Post.find(query).populate('poster').populate('community');
        const communities = await Community.find();
        const user = await getUser(req);

        res.render('home', { locals, data, communities, user});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error performing search');
    }

    // FOR POST METHOD
    // try {
    //     const locals = {
    //         layout: 'layouts/main',
    //         title: "Search - The Forum",
    //         inCommunity: false
    //     };

    //     let searchTerm = req.body.searchTerm
    //     // regex, removes any non-numerical/alphabetical character (replace with empty String)
    //     const searchInsensitive = searchTerm.replace(/[^a-zA-Z0-9]/g, "")

    //     const data = await Post.find({
    //         $or: [
    //             { title: {$regex: new RegExp(searchInsensitive, 'i')}},
    //             { content: {$regex: new RegExp(searchInsensitive, 'i')}}
    //         ]
    //     }).populate('poster').populate('community');
    //     const user = await getUser(req);
    //     const communities = await Community.find();
    //     res.render('home', { locals, data, communities, user });
    //     //res.send(searchTerm)
    // } catch (error) {
    //     console.log(error);
    // }
});

module.exports = router;