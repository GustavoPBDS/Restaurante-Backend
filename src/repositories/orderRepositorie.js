const knex = require('knex'),
    config = require('../database/index')

module.exports = new class orderRepositorie{
    constructor(){this.db = knex(config.dev)}

    async create (orderObject) {
        try {
            return await this.db.transaction(async trx=>{
                const orderModel = trx('order')
                await orderModel.insert(orderObject)
                return
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
    async update (orderObject){
        try {
            return await this.db.transaction(async trx=>{
                const orderModel = trx('order')
                await orderModel.where({'oid':orderObject.oid}).update(orderObject)
                return
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async updatePrice (oid, price){
        try {
            return await this.db.transaction(async trx=>{
                const orderModel = trx('order')
                await orderModel.where({oid}).update({total_price:price})
                return
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async deleteOrder(oid){
        try {
            return await this.db.transaction(async trx=>{
                const orderModel = trx('order')
                await orderModel.delete().where({oid})
                return
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getOrderById(oid){
        try {
            return await this.db.transaction(async trx=>{
                const orderModel = trx('order')
                return await orderModel.select().where({oid}).first()
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getAllOrders(uid){
        try {
            return await this.db.transaction(async trx=>{
                const orderModel = trx('order')
                return await orderModel.select().where({uid})
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
}