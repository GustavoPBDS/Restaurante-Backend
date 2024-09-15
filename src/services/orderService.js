const orderItemRepositorie = require('../repositories/orderItemRepositorie')
const orderRepositorie = require('../repositories/orderRepositorie'),
    stringsValidations = require('../utils/stringsValidations'),
    numbersValidations = require('../utils/numbersValidations'),
    createUUID = require('../utils/createId')

const {escape} = require('validator')

module.exports = class Order{
    constructor(oid, uid, created_at, status, total_price){
        this.oid = oid
        this.uid = uid
        this.created_at = created_at
        this.status = status
        this.total_price = total_price
    }
    static async createOrder (orderData) {
        try {
            const {total_price, uid, status} = orderData,
                oid = createUUID(),
                created_at = Date.now()

            await numbersValidations.verifyPrice(total_price)
            await this.verifyStatus(status)

            return new Order(oid, uid, created_at, status, total_price)
        } catch (err) {
            throw err
        }
    }
    static async verifyStatus (status){
        try {
            const statusAcceptable = ['PAGO', 'PENDENTE']
            if (!statusAcceptable.find(stat=>stat == status)) throw {code:400, message:'Status do pedido inválido'}
            return true
        } catch (err) {
            throw err
        }
    }

    static async getOrderById (oid){
        try {
            const res = await orderRepositorie.getOrderById(oid)
            if (!res) throw {code: 404, message:'Pedido não encontrado'}
            return res
        } catch (err) {
            throw err
        }
    }
    static async getAllOrders(uid){
        try {
            return await orderRepositorie.getAllOrders(uid)
        } catch (err) {
            throw err
        }
    }


    static async updatePrice(oid, price){
        try {
            return await orderRepositorie.updatePrice(oid, price)
        } catch (err) {
            throw err
        }
    }
    static async deleteOrder(oid){
        try {
            await orderItemRepositorie.deleteOrderItens(oid)
            return await orderRepositorie.deleteOrder(oid)
        } catch (err) {
            throw err
        }
    }
}