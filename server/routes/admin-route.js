const express = require('express')
const router = express.Router()
const bCrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Post = require('../model/Post')
const AdminUser = require('../model/Admin-user')


// JWT secretkey
const jwt_secret_token = process.env.JWT_SECRET_TOKEN

/**
 *  GET
 *  ADMIN LOGIN-PAGE
 */
router.get('/admin', (req, res) => {
    try {
        res.render('admin/login-page', { title: 'login?', message: req.flash() }); 
    } catch (error) {
        console.log(error)
    }
})

/**
 *  POST
 *  ADMIN LOGIN-PAGE
 */
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await AdminUser.findOne({ username })

        if (!user) {
            req.flash('error', 'Invalid credentials')
            return res.redirect('/admin')
        }

        const isPasswordValid = await bCrypt.compare(password, user.password)

        if (!isPasswordValid) {
            req.flash('error', 'Invalid credentials')
            return res.redirect('/admin')
        }

        const accessToken = jwt.sign({ userId: user._id }, jwt_secret_token)

        res.cookie('accessToken', accessToken, {
            httpOnly: true
        })

        res.redirect('/admin/dashboard')

    } catch (error) {
        console.log(error)
    }
})


/**
 * Authentication Middleware
 */
const authenticate = (req, res, next) => {

    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        return res.status(401).send('Unauthorized')
    }

    try {
        jwt.verify(accessToken, jwt_secret_token, (err, userId) => {
            if (err) return res.status(403).send('Forbidden')
            req.userId = userId
        });
        return next()
    } catch (error) {
        return res.status(401).send('Unauthorized')
    }
}

/**
 *  GET
 *  ADMIN REGISTRATION-PAGE
 */
router.get('/admin/register', (req, res) => {
    try {
        res.render('admin/registration-page', { title: 'register?' })   
    } catch (error) {
        console.log(error)
    }
})

/**
 *  POST
 *  ADMIN REGISTRATION-PAGE
 */
router.post('/admin/register', async (req, res) => {
    try {
        const { username, password } = req.body
        // hash the password
        
        const hashPassword = await bCrypt.hash(password, 10)

        try {
            const userExists = await AdminUser.exists({ username: username })
            if (userExists == null) {
                await AdminUser.create({ username, password:hashPassword })
                return res.status(201).send('Registered successfully')
            } else {
                return res.status(409).send('User already in use.')
            }
        } catch (error) {
            return res.status(500).send('Internal server error')
        }
    } catch (error) {
        console.log(error)
    }
})

/**
 *  GET
 *  ADMIN VALIDATION-PAGE
 */
router.get('/admin/validation', (req, res) => {
    try {
        res.render('admin/validation', { title: 'validate' })   
    } catch (error) {
        console.log(error)
    }
})

/**
 *  POST
 *  ADMIN VALIDATION-PAGE
 */
router.post('/admin/validation', (req, res) => {
    try {
        let inputValue = req.body.codename
        let isValid = inputValue === process.env.CODENAME ? true : false

        // if it's valid, redirect to the registration page
        if (isValid) {
            res.redirect('/admin/register')
        } else {
            return res.status(401).send('Unauthorized')
        }
    } catch (error) {
        console.log(error)
    }
})

/**
 *  GET
 *  ADMIN DASHBOARD-PAGE
 */
router.get('/admin/dashboard', authenticate, async (req, res) => {
    try {
        const data = await Post.find()
        res.render('admin/dashboard', { data, title: 'Dashboard' })
    } catch (error) {
        console.log(error)
    }
})

/**
 *  GET
 *  Add new Project post
 */
router.get('/admin/dashboard/add-new-project', authenticate, (req, res) => {
    try {
        res.render('admin/add-new-project', { title: 'Add new project' })
    } catch (error) {
        console.log(error)
    }
})

/**
 *  POST
 *  Add new Project post
 */
router.post('/admin/dashboard/add-new-project', authenticate, async (req, res) => {
    try {
        try {
            const newProjectPost = new Post({
                title: req.body.title,
                description: req.body.description,
                link: req.body.link,
                video_ID: req.body.video_ID
            })
            await Post.create(newProjectPost)
            res.redirect('/admin/dashboard')   
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router