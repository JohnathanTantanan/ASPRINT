const express = require('express')
const router = express.Router()
const dataModule = require('../../data')
//Server Model/Schema
const Post = require('../models/Post')

/**GET /
 * HOME
 */
router.get(['', '/home'], async (req,res)=>{
    //const posts = dataModule.getData('./posts.json');
    const locals = { 
        layout: 'layouts/main',
        title: "The Forum",
        description: "Simple Blog created with NodeJs, Express & MongoDB."
    }

    try {
        const data = await Post.find();
        res.render('home', {locals, data});
    } catch (error) {
        console.log(error);
    } 
    
}); 
/**GET /
 * POST PAGE
 */
router.get('/post-page1', (req, res) => { // testing, fixed post-page num
    const locals = {
        layout: 'layouts/main'
    };
    res.render('post-page', locals);
});

/**GET /
 * LOGIN AND REGISTER
 */
router.get('/login',(req,res)=>{
    res.render('login-register', {
        layout: 'layouts/auth',
        formType: 'login'})
});

router.get('/register',(req,res)=>{
    res.render('login-register', {
        layout: 'layouts/auth',
        formType: 'register'})
});

router.get('/communities',(req,res)=>{
    res.render('communities', {
        layout: 'layouts/main',
        title: "The Forum",
        description: "Simple Blog created with NodeJs, Express & MongoDB."})
});

router.get('/popular', async(req,res)=>{
    //var sorted = posts.sort((a, b) => b.upvotes - a.upvotes);
    const locals = {
        layout: 'layouts/main',
        title: "The Forum",
        description: "Simple Blog created with NodeJs, Express & MongoDB.",
    }

    try {
        const data = await Post.find({ upvotes: {$gt: 200} }).sort({ upvotes: -1 }); // compute upvote - downvote
        res.render('home', {locals, data});
        // res.render('popular', locals)
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;