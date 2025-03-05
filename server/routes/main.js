const express = require('express')
const router = express.Router()

const dataModule = require('../../data');

router.get(['', '/home'],(req,res)=>{
    const posts = dataModule.getPosts();
    const locals = {
        layout: 'layouts/main',
        title: "The Forum",
        description: "Simple Blog created with NodeJs, Express & MongoDB.",
        posts: posts
    }
    res.render('home', locals)
})

router.get('/login',(req,res)=>{
    res.render('login-register', {
        layout: 'layouts/auth',
        formType: 'login'})
})

router.get('/register',(req,res)=>{
    res.render('login-register', {
        layout: 'layouts/auth',
        formType: 'register'})
})

router.get('/about',(req,res)=>{
    res.render('about')
})

module.exports = router