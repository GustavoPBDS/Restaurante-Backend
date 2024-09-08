const orderItemRepositorie = require('../repositories/orderItemRepositorie'),
    stringsValidations = require('../utils/stringsValidations'),
    numbersValidations = require('../utils/numbersValidations'),
    createUUID = require('../utils/createId')
const productService = require('../services/productService')
const {escape} = require('validator')

module.exports = class OrderItem{
    constructor(id, oid, pid, amount, item_price){
        this.id = id
        this.oid = oid
        this.pid = pid
        this.amount = amount
        this.item_price = item_price
    }
    static async createOrderItem (orderItemData) {
        try {
            const {oid, pid, amount, item_price} = orderItemData,
                id = createUUID()

            await numbersValidations.verifyPrice(item_price)

            return new OrderItem(id, oid, pid, amount, item_price)
        } catch (err) {
            throw err
        }
    }
    static async getOrderItemById(id){
        try {
            const res =  await orderItemRepositorie.getOrderItemById(id)
            if (!res) throw {code:404, message:"Item não encontrado"}
            return res
        } catch (err) {
            throw err
        }
    }
    static async getAllOrderItens(oid){
        try {
            let itens = await orderItemRepositorie.getAllOrderItens(oid)
            itens = itens.map(async(item)=>{
                const product = await productService.getProductById(item.pid)
                return {...item, productName: product.name, productImg: product.productImage}
            })
            return await Promise.all(itens)
        } catch (err) {
            throw err
        }
    }
    static async updateAmount (id, amount){
        try {
            return await orderItemRepositorie.updateAmount(id, amount)
        } catch (err) {
            throw err
        }
    }
    static async deleteOrderItem(id){
        try {
            return await orderItemRepositorie.deleteOrderItem(id)
        } catch (err) {
            throw err
        }
    }
}