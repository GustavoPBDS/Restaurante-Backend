const express = require('express'),
    router = express.Router(),
    {auth, authAdmin} = require('../middlewares/authMiddleware'),
    {uploadImage} = require('../middlewares/multerMiddleware')

const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const orderController = require('../controllers/orderController')
const orderItemController = require('../controllers/orderItemController')
const commentController = require('../controllers/commentController')

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
router.post('/send-email', auth, userController.sendEmail)

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

// comment routes
router.get('/comments/:pid', commentController.comments)

router.post('/comment/:pid', auth, commentController.create)

router.put('/comment/:pid/:cid', auth, commentController.update)

router.delete('/comment/:pid/:cid', auth, commentController.remove)

//order routes
router.get('/orders', auth, orderController.getAllOrders)

router.post('/order', auth, orderController.create)

router.put('/pay-order/:oid', auth, orderController.payOrder)

router.delete('/cancel-order/:oid', auth, orderController.cancelOrder)

//order itens routes
router.get('/order/:oid', auth, orderItemController.itens)

router.post('/order/item/:oid/:pid', auth, orderItemController.create)

router.put('/order/item/:oid/:pid/:id', auth, orderItemController.updateAmount)

router.delete('/order/item/:oid/:pid/:id', auth, orderItemController.deleteOrderItem)

module.exports = router