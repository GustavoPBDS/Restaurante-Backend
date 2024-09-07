const knex = require('knex'),
    config = require('../database/index')

module.exports = new class productRepositories{
    constructor(){this.db = knex(config.dev)}

    async create (productObject) {
        try {
            return await this.db.transaction(async trx=>{
                const productModel = trx('product')
                await productModel.insert(productObject)
                return
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
    async update (productObject){
        try {
            return await this.db.transaction(async trx=>{
                const productModel = trx('product')
                await productModel.where({'pid':productObject.pid}).update(productObject)
                return
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async updateRating(pid, rating){
        try {
            return await this.db.transaction(async trx=>{
                const productModel = trx('product')
                await productModel.where({pid}).update({rating})
                return
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async deleteProduct(pid){
        try {
            return await this.db.transaction(async trx=>{
                const productModel = trx('product')
                await productModel.delete().where({pid})
                return
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }

    async getProducts (){
        try {
            return await this.db.transaction(async trx=>{
                const productModel = trx('product')
                return await productModel.select()
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getProductById (pid){
        try {
            return await this.db.transaction(async trx=>{
                const productModel = trx('product')
                return await productModel.select().where({pid}).first()
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getProductsByName (name){
        try {
            return await this.db.transaction(async trx=>{
                const productModel = trx('product')
                return await productModel.select().where({name})
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getProductsByCategory (category){
        try {
            return await this.db.transaction(async trx=>{
                const productModel = trx('product')
                return await productModel.select().where({category})
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
    async searchProduct(name, categories){
        try {
            return await this.db.transaction(async trx=>{
                const productModel = trx('product')
                return await productModel.select().where(function(){
                    if (name) this.where('name', 'like', `%${name}%`)
                    if (categories && categories.length > 0) this.where('category', 'in', categories)
                })
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
}