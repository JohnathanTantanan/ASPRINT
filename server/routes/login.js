const express = require('express')
const router = express.Router()
const dataModule = require('../../data')
//Server Model/Schema
const Community = require('../models/Community')
const Post = require('../models/Post')
const User = require('../models/User')
const Comments = require('../models/Comments')
const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken')
const { redirect } = require('express/lib/response')
const multer = require('multer')
var ObjectId = require('mongodb').ObjectId;
var loggeduser = null;
const { getUser } = require('../middleware/auth');

/**GET /
 * LOGIN AND REGISTER
 */
const authMiddleware = async (req,res,next) => {
        const token = req.cookies.token;

        if(!token){
            console.error('No token provided, redirecting to login');
            return res.redirect('/login'); // Redirect to login if no token is found
            // return res.status(401).json({message: 'Unauthorized'});
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            next();
        } catch (error) {
            return res.status(401).json({message: 'Unauthorized'});
        }
}


// Set up multer for file uploads (Profile Picture)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });


/**GET /
 * LOGIN
 */
router.get('/login', async (req,res)=>{
    try {
        res.render('login', {
            layout: 'layouts/auth'})
    } catch (error) {
        console.log(error);
    }
});

/**GET /
 * REGISTER
 */
router.get('/register', async(req,res)=>{
    try {
        res.render('register', {
            layout: 'layouts/auth'})
    } catch (error) {
        console.log(error);
    }
});

router.get('/myprofile', authMiddleware, async(req,res)=>{
    try {
        const locals = { 
            layout: 'layouts/main',
            title: "The Forum",
            description: "Simple Blog created with NodeJs, Express & MongoDB."
        }
        
        const user = await getUser(req);
        if (!user) {
            console.log('No user found, redirecting to login');
            return res.redirect('/login'); // Redirect to login if no user is found
        }
        let userId = user._id.toString();
        const posts = await Post.find({poster: new ObjectId(userId)}).sort({createdAt: -1});
        const comments = await Comments.find({commenter: new ObjectId(userId)}).sort({createdAt: -1}); // comments of logged user
        communities = await Community.find();

        res.render('myprofile', {
            locals,
            user,
            comments,
            posts,
            communities
            });

    } catch (error) {
        console.log(error);
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    req.session.destroy(err => { // remove sssion, free up memory
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
});


/**GET /
 * VIEW USER PROFILE 
 */
router.get('/user-profile/:id', async (req, res) => {
    try {
        const locals = { 
            layout: 'layouts/main',
            title: "The Forum",
            description: "Simple Blog created with NodeJs, Express & MongoDB."
        }

        //const postId = new mongoose.Types.ObjectId(req.params.id);
        const user = await getUser(req); // logged-in user
        const userViewed = await User.findById(req.params.id); // returns a single mongoose document 
        const comments = await Comments.find({ commenter: req.params.id }); // returns array of mongoose documents 
        const posts = await Post.find({ poster: req.params.id });
        const communities = await Community.find();
        res.render('user-profile', {locals, userViewed, user, comments, posts, communities}); // should this be data.toObject()? why
    } catch (error) {
        console.log(error);
    }

    // Note: findById() can take in strings, but find() expects querys enclosed in {object literals}
});


/**POST /
 * LOGIN FORM SUBMISSION
 */
router.post('/login', async (req,res)=>{
    try {
        const { username, password, 'remember-me': rememberMe } = req.body;
        
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message: 'Invalid Credentials'});
        } 

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: 'Wrong Password'});
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const cookieOptions = {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
        };

        // Set cookie expiration based on "Remember Me"
        if (rememberMe) {
            cookieOptions.maxAge = 1000 * 60 * 60 * 24 * 21; // set cookie lifespan: 3 weeks in milliseconds
        }
        // Set the logged user in the session
        loggeduser = user; // consider removing

        res.cookie('token', token, cookieOptions);
        res.redirect('/myprofile');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**POST /
 * REGISTER FORM SUBMISSION
 */
router.post('/register', async (req,res)=>{
    try {
        const { username, password, confirm } = req.body;

        // Password validation
        if (password.length < 8) {
            return res.render('register', {
                layout: 'layouts/auth',
                errorMessage: 'Password must be at least 8 characters long'
            });
        }

        // Check for at least one number
        if (!/\d/.test(password)) {
            return res.render('register', {
                layout: 'layouts/auth',
                errorMessage: 'Password must contain at least one number'
            });
        }

        // Check for at least one special character
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (!specialChars.test(password)) {
            return res.render('register', {
                layout: 'layouts/auth',
                errorMessage: 'Password must contain at least one special character'
            });
        }

        if (password !== confirm) {
            return res.render('register', {
                layout: 'layouts/auth',
                errorMessage: 'Passwords do not match'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({
                username,
                password: hashedPassword
            });
            res.redirect('/login');
        } catch (error) {
            if(error.code === 11000){
                return res.render('register', {
                    layout: 'layouts/auth',
                    errorMessage: 'Username already exists'
                });
            }
            return res.render('register', {
                layout: 'layouts/auth',
                errorMessage: 'Internal Server Error'
            });
        }
    } catch (error) {
        console.log(error);
        return res.render('register', {
            layout: 'layouts/auth',
            errorMessage: 'Server error occurred'
        });
    }
});

/**POST /
 * ADD COMMENT
 */
router.post('/addcomment/:id', authMiddleware, async (req,res)=>{
    try {
        const user = await getUser(req);
        if (!user) {
            console.log('No user found, redirecting to login');
            return res.redirect('/login');
        }

        let comment = new Comments({
            postId: req.params.id,
            commenter: user._id,
            comment: req.body.comment
        });

        await comment.save();
        res.redirect(`/post/${req.params.id}/${req.params.title}`);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


/**POST /
 * DELETE COMMENT
 */
router.post('/delete-comment/:id', authMiddleware, async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comments.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await Comments.findByIdAndDelete(commentId);
        res.redirect('back');
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**POST /
 * UPDATE PROFILE
 */
router.post('/update-profile/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.redirect('/login');
        }

        const { username, description } = req.body;
        user.username = username;
        user.description = description;

        if (req.file) {
            user.picture = `/uploads/${req.file.filename}`;
        }

        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// UPVOTES AND DOWNVOTES
router.post('/post/upvote/:id', async (req, res) => {    
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const user = await getUser(req); // logged-in user

        if (!user) {
            return res.status(401).json({ message: 'Please log in to vote' });
        }

        const existingVote = post.voters.find(voter => voter.user.toString() === user._id.toString());
        
        if (existingVote) {
            if (existingVote.voteType === 'upvote') {
                // Remove the upvote
                post.upvotes -= 1;
                post.voters = post.voters.filter(voter => voter.user.toString() !== user._id.toString());
            } else if (existingVote.voteType === 'downvote') {
                // Change downvote to upvote
                post.downvotes -= 1;
                post.upvotes += 1;
                existingVote.voteType = 'upvote';
            }
        } else {
            // Add a new upvote
            post.upvotes += 1;
            post.voters.push({ user: user._id, voteType: 'upvote' });
        }
        //Testing
        console.log('====== UPVOTE ROUTE ====');
        console.log('PostID in URL:', req.params.id);
        console.log('PostfindyId:', post._id);
        console.log('LoggedUser:', loggeduser);

        await post.save();
        res.json({ success: true, upvotes: post.upvotes, downvotes: post.downvotes });
    } catch (error) {
        console.error('Error upvoting post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/post/downvote/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const user = await getUser(req); // logged-in user
        
        if (!user) {
            return res.status(401).json({ message: 'Please log in to vote' });
        }

        const existingVote = post.voters.find(voter => voter.user.toString() === user._id.toString());

        if (existingVote) {
            if (existingVote.voteType === 'downvote') {
                // Remove the downvote
                post.downvotes -= 1;
                post.voters = post.voters.filter(voter => voter.user.toString() !== user._id.toString());
            } else if (existingVote.voteType === 'upvote') {
                // Change upvote to downvote
                post.upvotes -= 1;
                post.downvotes += 1;
                existingVote.voteType = 'downvote';
            }
        } else {
            // Add a new downvote
            post.downvotes += 1;
            post.voters.push({ user: user._id, voteType: 'downvote' });
        }

        await post.save();
        res.json({ success: true, upvotes: post.upvotes, downvotes: post.downvotes });
    } catch (error) {
        console.error('Error downvoting post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;