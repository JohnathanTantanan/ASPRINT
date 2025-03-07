const express = require('express')
const router = express.Router()
const dataModule = require('../../data')
//Server Model/Schema
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var ObjectId = require('mongodb').ObjectId;
var loggeduser = User.findOne({_id: new ObjectId("67ca9bd51f75539afbfc6714")});

/**GET /
 * LOGIN AND REGISTER
 */
const authMiddleware = async (req,res,next) => {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({message: 'Unauthorized'});
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            next();
        } catch (error) {
            return res.status(401).json({message: 'Unauthorized'});
        }
}

/**GET /
 * LOGIN AND REGISTER
 */
router.get('/login', async (req,res)=>{
    try {
        res.render('login', {
            layout: 'layouts/auth'})
    } catch (error) {
        console.log(error);
    }
});

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
        
        const user = await User.findOne({username: loggeduser.username});
        var userId = user._id.toString();
        const posts = await Post.find({username: new ObjectId(userId)});
        
        res.render('myprofile', {
            locals,
            user,
            posts});

    } catch (error) {
        console.log(error);
    }
});

/**POST /
 * LOGIN AND REGISTER
 */
router.post('/login', async (req,res)=>{
    try {


        const { username, password } = req.body;
        
        const user = await User.findOne({username});

        if(!user){
            return res.status(401).json({message: 'Invalid Credentials'});
        } 

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({message: 'Wrong Password'});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.cookie('token', token, {
            httpOnly: true
        });
        loggeduser = user;
        res.redirect('/myprofile');


    } catch (error) {
        console.log(error);
    }
});

router.post('/register', async (req,res)=>{
    try {
        const { username, password, confirm } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        if (password !== confirm) {
            res.status(408).json({message: 'Passwords do not match'});
        } else {
            try {
                const user = await User.create({
                    username,
                    password: hashedPassword
                });
                res.status(201).json({message: 'User Created', user});
                res.redirect('/login');
            }   catch (error) {
                if(error.code === 11000){
                    res.status(409).json({message: 'Username already exists'});
                }
                res.status(500).json({message: 'Internal Server Error'});
            }
        }
        


    } catch (error) {
        console.log(error);
    }
});




module.exports = router;