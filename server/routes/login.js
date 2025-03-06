const express = require('express')
const router = express.Router()
const dataModule = require('../../data')
//Server Model/Schema
const Post = require('../models/Post')
const User = require('../models/User')

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

/**POST /
 * LOGIN AND REGISTER
 */
router.post('/login', async (req,res)=>{
    try {


        const { username, password } = req.body;
        console.log(req.body);
        res.redirect('/login');


    } catch (error) {
        console.log(error);
    }
});

router.post('/register', async (req,res)=>{
    try {
        const { username, password, confirm } = req.body;

        if (password !== confirm) {
            console.log('Passwords do not match');
            res.redirect('/register');
        } else {
            try {
                const user = await User.create({
                    username,
                    password
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