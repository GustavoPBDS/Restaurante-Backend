const express = require('express'),
    router = express.Router(),
    {auth, authAdmin} = require('../middlewares/authMiddleware'),
    {uploadProfileImage} = require('../middlewares/multerMiddleware')

const userController = require('../controllers/userController')

router.get('/', (req, res)=>{
    res.send('Hello World!')
})

// user routes
router.get('/profile', auth, userController.profile)
router.get('/user/:uid', userController.getUser)
router.get('/users', authAdmin, userController.getUsers)

router.post('/register', uploadProfileImage, userController.register)
router.post('/register/admin', userController.registerAdmin)
router.post('/login', userController.login)

router.put('/user/:uid?', auth, uploadProfileImage, userController.update)

router.delete('/user/:uid?', auth, userController.remove)

// product routes

module.exports = router