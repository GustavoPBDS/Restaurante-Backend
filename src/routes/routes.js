const express = require('express'),
    router = express.Router(),
    {auth, authAdmin} = require('../middlewares/authMiddleware'),
    {uploadImage} = require('../middlewares/multerMiddleware')

const productController = require('../controllers/productController')
const userController = require('../controllers/userController')

router.get('/', (req, res)=>{
    res.send('Hello World!')
})

// user routes
router.get('/profile', auth, userController.profile)
router.get('/user/:uid', userController.getUser)
router.get('/users', authAdmin, userController.getUsers)

router.post('/register', uploadImage, userController.register)
router.post('/register/admin', userController.registerAdmin)
router.post('/login', userController.login)

router.put('/user/:uid?', auth, uploadImage, userController.update)

router.delete('/user/:uid?', auth, userController.remove)

// product routes
router.get('/products', productController.products)
router.get('/products/categories', productController.productsCategories)
router.get('/products/:category', productController.category)
router.get('/product/:pid', productController.product)
router.get('/search-product', productController.searchProduct)

router.post('/product', authAdmin, uploadImage, productController.create)

router.put('/product/:pid', authAdmin, uploadImage, productController.update)

router.delete('/product/:pid', authAdmin, productController.remove)

module.exports = router