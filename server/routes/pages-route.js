const express = require('express')
const router = express.Router()

const Post = require('../model/Post')
/**
 *  GET
 *  HOME PAGE
 */
router.get('/', (req, res) => {
    res.render('index', { title: 'Home' })
})

/**
 *  GET
 *  About PAGE
 */
router.get('/about', (req, res) => {
    try {
        res.render('About', { title: 'about me' })
    } catch (error) {
        console.log(error)
    }
})

/**
 *  GET
 *  Contact PAGE
 */
router.get('/contact', (req, res) => {
    res.render('Contact', { title: 'my contact' })
})

/**
 *  GET
 *  Project PAGE
 */
router.get('/personal-projects', async (req, res) => {
    try {
        const data = await Post.find()
        res.render('projects', { title: 'my personal projects', data })
    } catch (error) {
        console.log(error)
    }
})

/**
 *  GET
 *  Test Page
 */
router.get('/test', (req, res) => {
    res.render('test', { title: 'Test' })
})

module.exports = router