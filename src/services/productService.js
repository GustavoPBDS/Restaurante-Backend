const productRepositorie = require('../repositories/productRepositorie'),
    stringsValidations = require('../utils/stringsValidations'),
    createUUID = require('../utils/createId'),
    numberValidations = require('../utils/numbersValidations')

const {escape} = require('validator')

module.exports = class Product{
    constructor (pid, name, description, productImage, price, category, rating){
        this.pid = pid
        this.name = name
        this.description = description
        this.productImage = productImage
        this.price = price
        this.category = category
        this.rating = rating
    }
    static async createProduct(productData){
        try {
            const {name, description, category, price} = productData,
                productImage = productData.productImage ?? 'default',
                pid = productData.pid ?? createUUID(),
                rating = productData.rating ?? 0

            await this.verifyProductObject({name, description, category, price})

            return new Product(pid, name, description, productImage, price, category, rating)
        } catch (err) {
            throw err
        }
    }
    static async deleteProduct(pid){
        try {
            return await productRepositorie.deleteProduct(pid)
        } catch (err) {
            throw err
        }
    }

    static async verifyName (name){
        try {
            return await stringsValidations.validateName(name)
        } catch (err) {
            throw {code:400, message:'Tamanho do nome inválido'}
        }
    }
    static async verifyDescription (description){
        try {
            return await stringsValidations.validateDescription(description)
        } catch (err) {
            throw {code:400, message:'Descrição muito longa'}
        }
    }
    static async verifyProductObject(productObject){
        try {
            if( productObject.name ) await this.verifyName(productObject.name)
            if (productObject.description) await this.verifyDescription(productObject.description)
            if (productObject.category) await stringsValidations.notBlank(productObject.category)
            if (productObject.price) await numberValidations.verifyPrice(productObject.price)
            return true
        } catch (err) {
            throw err
        }
    }

    static async getProducts(){
        try {
            return await productRepositorie.getProducts()
        } catch (err) {
            throw err
        }
    }
    static async getProductById(pid){
        try {
            const res = await productRepositorie.getProductById(pid)
            if (!res) throw {code:404, message:'Produto não encontrado'}
            return res
        } catch (err) {
            throw err
        }
    }
    static async getProductsByCategory(category){
        try {
            return await productRepositorie.getProductsByCategory(category)
        } catch (err) {
            throw err
        }
    }
    static async getProductsCategories(){
        try {
            const allProducts = await this.orderByRating(await this.getProducts())
            const productsCategories = allProducts.reduce((prev, current)=>{
                if (!prev[current.category]) prev[current.category] = []
                prev[current.category].push(current)
                return prev
            }, {})
            return productsCategories
        } catch (err) {
            throw err
        }
    }

    static async searchProduct(name, categories){
        try {
            name = escape(name)
            categories = categories.map(cat=>escape(cat))
            
            return await productRepositorie.searchProduct(escape(name), categories)
        } catch (err) {
            throw err
        }
    }

    static async orderByRating(products){
        try {
            return products.sort((a, b) => b.rating - a.rating)
        } catch (err) {
            throw err
        }
    }
}