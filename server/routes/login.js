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

router.get('/register',(req,res)=>{
    res.render('register', {
        layout: 'layouts/auth'})
});

/**POST /
 * LOGIN AND REGISTER
 */
router.post('/login', async (req,res)=>{
    try {


        const { password } = req.body;
        console.log(req.body);
        res.redirect('/login');


    } catch (error) {
        console.log(error);
    }
});






module.exports = router;