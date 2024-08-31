const knex = require('knex'),
    config = require('../database/index'),
    db = knex(config.dev)

const productTable = async () => {
    try {
        const exist = await db.schema.hasTable('product')
        if (exist) return

        await db.schema.createTable('product', (table)=>{
            table.increments('_id').primary()
            table.string('pid', 36).unique()
            table.string('name', 50).notNullable().defaultTo('')
            table.text('description')
            table.string('productImage')
            table.decimal('price', 10, 2).notNullable().defaultTo(0)
            table.string('category').notNullable().defaultTo('')
            table.float('rating', 2, 1).defaultTo(0)
        })
        console.log('Tabela de produtos criada!')
    } catch (err) {
        throw err
    }
}
module.exports = productTable