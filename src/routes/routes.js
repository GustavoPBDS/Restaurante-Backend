const express = require('express'),
    router = express.Router(),
    {auth, authAdmin} = require('../middlewares/authMiddleware')

const userController = require('../controllers/userController')

router.get('/', (req, res)=>{
    res.send('Hello World!')
})

// user routes
router.get('/profile', auth, userController.profile)
router.get('/user/:uid', userController.getUser)
router.get('/users', authAdmin, userController.getUsers)

router.post('/register', userController.register)
router.post('/register/admin', userController.registerAdmin)
router.post('/login', userController.login)

// product routes

module.exports = router