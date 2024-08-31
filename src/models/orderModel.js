const knex = require('knex'),
    config = require('../database/index'),
    db = knex(config.dev)
    
const orderTable = async () => {
    try {
        const exist = await db.schema.hasTable('order')
        if (exist) return

        await db.schema.createTable('order', (table)=>{
            table.increments('_id').primary()
            table.string('oid', 36).unique()
            
            table.string('uid').notNullable().defaultTo('')
            table.foreign('uid').references('user.uid')

            table.bigint('created_at').defaultTo(Date.now())
            table.string('status')
            table.decimal('total_price', 10, 2)
        })
        console.log('Tabela de pedidos criada!')
    } catch (err) {
        throw err
    }
}

module.exports = orderTable