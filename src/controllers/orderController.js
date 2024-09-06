const orderRepositorie = require('../repositories/orderRepositorie'),
    orderItemRepositorie = require('../repositories/orderItemRepositorie'),
    orderService = require('../services/orderService'),
    orderItemService = require('../services/orderItemService')

const productService = require('../services/productService')

module.exports = new class{
    async create(req, res){
        try {
            const {user} = req,
                {orderBody} = req.body

            if (!orderBody.amount || !orderBody.pid) throw {code:400, message:'Falta informações sobre o pedido'}
            if (isNaN(orderBody.amount)) throw {code:400, message:'Quantidade inválida'}

            const product = await productService.getProductById(orderBody.pid)

            const orderData = {
                total_price: orderBody.amount * product.price,
                uid: user.uid,
                status: 'PENDENTE'
            }
            const orderObject = await orderService.createOrder(orderData)
            await orderRepositorie.create(orderObject)

            const orderItemData = {
                oid: orderObject.oid,
                pid: orderBody.pid,
                amount: orderBody.amount,
                item_price: product.price
            }
            const orderItemObject =  await orderItemService.createOrderItem(orderItemData)
            await orderItemRepositorie.create(orderItemObject)

            const orderItens = await orderItemService.getAllOrderItens(orderItemObject.oid),
                total_value = orderItens.reduce((prev, current)=>prev += (current.item_price * current.amount),0)

            await orderService.updatePrice(orderItemObject.oid, total_value)

            res.status(201).send({order:orderObject})
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async payOrder(req, res){
        try {
            const {user} = req,
                {oid} = req.params

            let order = await orderService.getOrderById(oid)
            if (order.uid !== user.uid) throw {code:401, message: "Esse pedido não é seu"}
            if (order.status === 'PAGO') throw {code: 401, message: 'Esse pedido ja está pago'}
            order.status = 'PAGO'

            await orderRepositorie.update(order)
            res.status(200).send({order})
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async cancelOrder(req, res){
        try {
            const {user} = req,
                {oid} = req.params

            const order = await orderService.getOrderById(oid)
            if (order.uid !== user.uid) throw {code:401, message: "Esse pedido não é seu"}

            await orderService.deleteOrder(oid)

            res.status(204).send()

        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async getAllOrders(req, res){
        try {
            const {user} = req
            const orders = await orderService.getAllOrders(user.uid)
            orders.sort((a, b)=>{
                if (a.status === 'PENDENTE' && b.status === 'PAGO') return -1;
                if (a.status === 'PAGO' && b.status === 'PENDENTE') return 1;
                return 0;
            })
            res.status(200).send({orders})

        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
}