const orderRepositorie = require('../repositories/orderRepositorie'),
    orderItemRepositorie = require('../repositories/orderItemRepositorie'),
    orderService = require('../services/orderService'),
    orderItemService = require('../services/orderItemService')

const productService = require('../services/productService')

module.exports = new class{
    async itens (req, res){
        try {
            const {user} = req,
                {oid} = req.params

            const order = await orderService.getOrderById(oid)
            if (order.uid !== user.uid) throw {code:401, message: "Esse pedido não é seu"}

            const orders = await orderItemService.getAllOrderItens(oid)

            res.status(200).send({orders})

        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async create(req, res){
        try {
            const {user} = req,
                {oid, pid} = req.params,
                {amount} = req.body
            
            if(isNaN(amount)) throw {code: 400, message:"Quantidade inválida"}
                
            let order = await orderService.getOrderById(oid)
            if (order.uid !== user.uid) throw {code: 401, message:'Esse pedido não é seu'}
            if (order.status === 'PAGO') throw {code: 401, message: 'Esse pedido ja está pago'}

            const product = await productService.getProductById(pid)

            const orderItemData = {
                oid, pid, amount,
                item_price: product.price
            }
            const orderItemObject = await orderItemService.createOrderItem(orderItemData)
            await orderItemRepositorie.create(orderItemObject)

            const orderItens = await orderItemService.getAllOrderItens(orderItemObject.oid),
                total_value = orderItens.reduce((prev, current)=>prev += (current.item_price * current.amount),0)

            await orderService.updatePrice(orderItemObject.oid, total_value)

            res.status(201).send({orderItem:orderItemObject})
            
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async deleteOrderItem(req, res){
        try {
            const {user} = req,
                {oid, pid, id} = req.params
            
                let order = await orderService.getOrderById(oid)
                if (order.uid !== user.uid) throw {code: 401, message:'Esse pedido não é seu'}

                const _ = await productService.getProductById(pid),
                    orderItem = await orderItemService.getOrderItemById(id)

            await orderItemService.deleteOrderItem(id)

            const orderItens = await orderItemService.getAllOrderItens(oid),
                total_value = orderItens.reduce((prev, current)=>prev += (current.item_price * current.amount),0)

            await orderService.updatePrice(oid, total_value)

            res.status(201).send()
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async updateAmount(req, res){
        try {
            const {user} = req,
                {oid, pid, id} = req.params,
                {amount} = req.body
            
            if(isNaN(amount)) throw {code: 400, message:"Quantidade inválida"}

            let order = await orderService.getOrderById(oid)
            if (order.uid !== user.uid) throw {code: 401, message:'Esse pedido não é seu'}
            if (order.status === 'PAGO') throw {code: 401, message: 'Esse pedido ja está pago'}

            const _ = await productService.getProductById(pid),
                orderItem = await orderItemService.getOrderItemById(id)

            await orderItemService.updateAmount(id, amount)

            const orderItens = await orderItemService.getAllOrderItens(oid),
                total_value = orderItens.reduce((prev, current)=>prev += (current.item_price * current.amount),0)

            await orderService.updatePrice(oid, total_value)
            
            res.status(200).send({orderItens})
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
}