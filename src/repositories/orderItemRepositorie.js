const knex = require('knex'),
    config = require('../database/index')

module.exports = new class orderRepositorie{
    constructor(){this.db = knex(config.dev)}

    async create (orderItemObject) {
        try {
            return await this.db.transaction(async trx=>{
                const orderItemModel = trx('orderItem')
                await orderItemModel.insert(orderItemObject)
                return
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
    async update (orderItemObject){
        try {
            return await this.db.transaction(async trx=>{
                const orderItemModel = trx('orderItem')
                await orderItemModel.where({'id':orderItemObject.id}).update(orderItemObject)
                return
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async updateAmount (id, amount){
        try {
            return await this.db.transaction(async trx=>{
                const orderItemModel = trx('orderItem')
                await orderItemModel.where({id}).update({amount})
                return
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getOrderItemById(id){
        try {
            return await this.db.transaction(async trx=>{
                const orderItemModel = trx('orderItem')
                return await orderItemModel.where({id}).select().first()
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async deleteOrderItem(id){
        try {
            return await this.db.transaction(async trx=>{
                const orderItemModel = trx('orderItem')
                console.log(id)
                await orderItemModel.delete().where({id})
                return
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getAllOrderItens(oid){
        try {
            return await this.db.transaction(async trx=>{
                const orderItemModel = trx('orderItem')
                return await orderItemModel.select().where({oid})
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
}