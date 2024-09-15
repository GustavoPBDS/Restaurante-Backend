const knex = require('knex'),
    config = require('../database/index'),
    db = knex(config.dev)

const commentTable = async () => {
    try {
        const exist = await db.schema.hasTable('comment')
        if (exist) return

        await db.schema.createTable('comment', (table)=>{
            table.increments('_id').primary()
            table.string('cid', 36).unique()
            
            table.string('uid').notNullable().defaultTo('')
            table.foreign('uid').references('user.uid')

            table.string('pid').notNullable().defaultTo('')
            table.foreign('pid').references('product.pid')

            table.bigint('created_at').defaultTo(Date.now())
            table.bigint('updated_at').nullable()
            table.text('body').notNullable().defaultTo('')
            table.float('rating').defaultTo(0)
        })
        console.log('Tabela de comentario criada!')
    } catch (err) { 
        throw err
    }
}
    
module.exports = commentTable