const knex = require('knex'),
    config = require('../database/index'),
    db = knex(config.dev)
    
const orderItemTable = async () => {
    try {
        const exist = await db.schema.hasTable('orderItem')
        if (exist) return

        await db.schema.createTable('orderItem', (table)=>{
            table.increments('_id').primary()
            table.string('id', 36).unique()
            
            table.string('oid').notNullable().defaultTo('')
            table.foreign('oid').references('order.oid')

            table.string('pid').notNullable().defaultTo('')
            table.foreign('pid').references('product.pid')

            table.integer('amount').notNullable().defaultTo(0)
            table.decimal('item_price', 10, 2).notNullable().defaultTo(0)

        })
        console.log('Tabela de item do pedido criada!')
    } catch (err) {
        throw err
    }
}

module.exports = orderItemTable