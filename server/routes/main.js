const express = require('express')
const router = express.Router()

const locals = {
    title: "NodeJs Blog",
    description: "Simple Blog created with NodeJs, Express & MongoDB."
}

router.get('',(req,res)=>{
    res.render('home', { locals, layout: 'layouts/main' })
})

router.get('/home',(req,res)=>{
    res.render('home', { locals, layout: 'layouts/main' })
})

router.get('/login',(req,res)=>{
    res.render('login', { locals, layout: 'layouts/main' })
})

router.get('/communities',(req,res)=>{
    res.render('communities', { locals, layout: 'layouts/main' })
})

router.get('/createpost',(req,res)=>{
    res.render('createpost', { locals, layout: 'layouts/main' })
})

router.get('/myprofile',(req,res)=>{
    res.render('myprofile', { locals, layout: 'layouts/main' })
})

router.get('/popular',(req,res)=>{
    res.render('popular', { locals, layout: 'layouts/main' })
})
module.exports = router