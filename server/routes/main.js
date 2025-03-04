const express = require('express')
const router = express.Router()

// const dataModule = require('../data');

router.get('',(req,res)=>{
    // const posts = dataModule.getPosts();
    const locals = {
        title: "The Forum",
        description: "Simple Blog created with NodeJs, Express & MongoDB."
    }
    res.render('index', { locals, layout: 'layouts/main' })
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