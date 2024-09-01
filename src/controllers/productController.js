const productRepositorie = require('../repositories/productRepositorie'),
    productService = require('../services/productService'),
    {createFileImage, deleteFileImage, getImagePath} = require('../utils/imageFunctions')

const path = require('path')
const fs = require('fs')
const port = process.env.PORT

module.exports = new class{
    async create(req, res){
        try {
            const product = JSON.parse(req.body.product)

            if (!product) throw {code:400, message:'Requisição inválida'}
            if (!product.name || !product.description || !product.category || !product.price) throw {code:400, message:'Preencha todos os campos'}
            
            let productImage = 'default',
                filename, filePath

            if (req.file) {
                filename = `${Date.now()}_${req.file.originalname}`
                filePath = path.join('public/productImages', filename)
                productImage = `http://localhost:${port}/${filePath}`
            }

            const Product = await productService.createProduct({...product, productImage})

            await productRepositorie.create(Product)

            if (req.file) createFileImage(filePath, req.file.buffer)

            res.status(201).send({product:Product})
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async update(req, res){
        try {
            const {pid} = req.params
            let productObject = JSON.parse(req.body.product)

            if (!pid) throw {code:400, message: 'Produto não informado'}

            await productService.verifyProductObject(productObject)

            const productInDb = await productService.getProductById(pid)

            let productImage = productInDb.productImage,
                filename, filePath, previusPath

            if (req.file) {
                filename = `${Date.now()}_${req.file.originalname}`
                filePath = path.join('public/productImages', filename)
                previusPath = getImagePath(productImage)
                productImage = `http://localhost:${port}/${filePath}`
            }

            productObject = {...productObject, productImage, pid}

            await productRepositorie.update(productObject)
            const product = await productService.getProductById(pid)

            if (req.file) {
                if (productImage !== "default") await deleteFileImage(previusPath)
                createFileImage(filePath, req.file.buffer)
            }
            
            res.status(200).send({product})
            
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async remove(req, res){
        try {
            const {pid} = req.params

            if (!pid) throw {code:400, message:'Produto não informado'}
            await productService.getProductById(pid)

            await productService.deleteProduct(pid)

            res.status(204).send()
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async searchProduct(req, res){
        try {
            let {name, categories} = req.query

            categories = categories ? categories.split(',') : []
            name = name ?? ''

            const searchResult = await productService.orderByRating(await productService.searchProduct(name, categories))

            res.status(200).send({products:searchResult})
            
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async products(req, res){
        try {
            let products = await productService.getProducts()
            products = await productService.orderByRating(products)
            res.status(200).send({products})
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async product(req, res){
        try {
            const {pid} = req.params
            if(!pid) throw {code:400, message: 'Produto não informado'}

            const product = await productService.getProductById(pid)
            
            res.status(200).send({product})
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async category(req, res){
        try {
            const {category} = req.params
            if (!category) throw {code:400, message:'Categoria não informada'}

            const products = await productService.getProductsByCategory(category)

            res.status(200).send({products})
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async productsCategories(req, res){
        try {
            const products = await productService.getProductsCategories()
            
            res.status(200).send({products})
        } catch (err) { 
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
}