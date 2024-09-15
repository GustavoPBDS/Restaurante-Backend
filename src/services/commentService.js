const commentRepositorie = require('../repositories/commentRepositorie'),
    stringsValidations = require('../utils/stringsValidations'),
    numbersValidations = require('../utils/numbersValidations'),
    createUUID = require('../utils/createId')

const {escape} = require('validator')
const userService = require('../services/userService')

module.exports = class Comment{
    constructor(cid, uid, pid, created_at, updated_at, body, rating){
        this.cid = cid
        this.uid = uid
        this.pid = pid
        this.created_at = created_at
        this.updated_at = updated_at
        this.body = body
        this.rating = rating
    }
    static async createComment (commentData) {
        try {
            const {uid, pid, body, rating} = commentData,
                cid = createUUID(),
                created_at = Date.now()

            await stringsValidations.notBlank(body)
            await numbersValidations.verifyRating(rating)

            return new Comment(cid, uid, pid, created_at, null, body, rating)
        } catch (err) {
            throw err
        }
    }
    static async getCommentById(cid){
        try {
            const res =  await commentRepositorie.getCommentById(cid)
            if (!res) throw {code:404, message:"Comentario não encontrado"}
            return res
        } catch (err) {
            throw err
        }
    }
    static async getAllComments(pid){
        try {
            let Comments = await commentRepositorie.getAllComments(pid)
            Comments = Comments.map(async (comment)=>{
                const user = await userService.getUserById(comment.uid)
                return {...comment, userImage:user.profileImg, userName:user.name}
            })
            return await Promise.all(Comments)
        } catch (err) {
            throw err
        }
    }
    static async deleteComment(cid){
        try {
            return await commentRepositorie.deleteComment(cid)
        } catch (err) {
            throw err
        }
    }
    static async updateComment(cid, commentObject){
        try {
            await stringsValidations.notBlank(commentObject.body)
            await numbersValidations.verifyRating(commentObject.rating)

            commentObject = {...commentObject, updated_at: Date.now()}

            return await commentRepositorie.update(cid, commentObject)
        } catch (err) {
            throw err
        }
    }
    
}