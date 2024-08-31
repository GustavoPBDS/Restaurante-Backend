const knex = require('knex'),
    config = require('../database/index')

module.exports = new class userRepositorie{
    constructor(){
        this.db = knex(config.dev)
    }
    async create (userObject) {
        try {
            return await this.db.transaction(async trx=>{
                const userModel = trx('user')
                await userModel.insert(userObject)
                return
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getAdmin (){
        try {
            return await this.db.transaction(async trx=>{
                const userModel = trx('user')
                const res = await userModel.select().where('admin', true).first()
                return res
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getUsers (){
        try {
            return await this.db.transaction(async trx=>{
                const userModel = trx('user')
                const res = await userModel.select('uid', 'name', 'email', 'profileImg', 'admin')
                return res
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getUserById(uid){
        try {
            return await this.db.transaction(async trx=>{
                const userModel = trx('user')
                const res = await userModel.select('uid', 'name', 'email', 'profileImg', 'admin').where('uid', uid).first()
                return res
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getUserByEmailPublic (email){
        try {
            return await this.db.transaction(async trx=>{
                const userModel = trx('user')
                return await userModel.select('uid', 'name', 'email', 'profileImg', 'admin').where('email', email).first()
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getUserByEmailPrivate (email){
        try {
            return await this.db.transaction(async trx=>{
                const userModel = trx('user')
                return await userModel.select().where('email', email).first()
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
}