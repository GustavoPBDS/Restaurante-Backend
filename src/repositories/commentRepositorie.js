const knex = require('knex'),
    config = require('../database/index')

module.exports = new class commentRepositorie{
    constructor(){this.db = knex(config.dev)}

    async create (commentObject) {
        try {
            return await this.db.transaction(async trx=>{
                const commentModel = trx('comment')
                await commentModel.insert(commentObject)
                return
            })
        } catch (err) {
            throw {code:500, message: err.sqlMessage}
        }
    }
    async update (cid, {body, rating, updated_at}){
        try {
            return await this.db.transaction(async trx=>{
                const commentModel = trx('comment')
                return await commentModel.where({cid}).update({body, rating, updated_at})
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getCommentById(cid){
        try {
            return await this.db.transaction(async trx=>{
                const commentModel = trx('comment')
                return await commentModel.where({cid}).select().first()
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async deleteComment(cid){
        try {
            return await this.db.transaction(async trx=>{
                const commentModel = trx('comment')
                await commentModel.delete().where({cid})
                return
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async deleteCommentsFromUser(uid){
        try {
            return await this.db.transaction(async trx=>{
                const commentModel = trx('comment')
                await commentModel.delete().where({uid})
                return
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async deleteCommentsFromProduct(pid){
        try {
            return await this.db.transaction(async trx=>{
                const commentModel = trx('comment')
                await commentModel.delete().where({pid})
                return
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
    async getAllComments(pid){
        try {
            return await this.db.transaction(async trx=>{
                const commentModel = trx('comment')
                return await commentModel.select().where({pid})
            })
        } catch (err) {
            console.log(err)
            throw {code:500, message: err.sqlMessage}
        }
    }
}