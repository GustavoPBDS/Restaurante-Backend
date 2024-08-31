const knex = require('knex'),
    config = require('../database/index'),
    db = knex(config.dev)

const userTable = async() => {
    try {
        const exist = await db.schema.hasTable('user')
        if (exist) return

        await db.schema.createTable('user', (table)=>{
            table.increments('_id').primary()
            table.string('uid', 36).unique()
            table.string('name', 50).notNullable().defaultTo('')
            table.string('profileImg')
            table.string('email', 100).notNullable().defaultTo('')
            table.string('password', 200).notNullable().defaultTo('')
            table.boolean('admin').defaultTo(false)
        })
        console.log('Tabela de usuarios criada!')
    } catch (err) {
        throw err
    }
}

module.exports = userTable