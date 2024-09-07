const commentRepositorie = require('../repositories/commentRepositorie'),
    commentService = require('../services/commentService')

const productService = require('../services/productService')

module.exports = new class{
    async comments(req, res){
        try {
            const {user} = req,
                {pid} = req.params

            const product = await productService.getProductById(pid)

            const comments = await commentService.getAllComments(pid)

            res.status(200).send({comments})
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
                {pid} = req.params,
                {body, rating} = req.body

            const product = await productService.getProductById(pid)

            const commentData = {
                uid: user.uid,
                pid, body, rating
            }
            const commentObject = await commentService.createComment(commentData)
            await commentRepositorie.create(commentObject)

            const comments = await commentService.getAllComments(pid),
                productRating = comments.reduce((prev, current)=> prev + current.rating, 0) / comments.length

            await productService.updateRating(pid, productRating)

            res.status(200).send({comment: commentObject})
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async update(req, res){
        try {
            const {user} = req,
                {pid, cid} = req.params,
                {body, rating} = req.body

            let comment = await commentService.getCommentById(cid)
            if (comment.uid !== user.uid && !user.admin) throw {code:401, message:'Você não tem permissão para isso'}

            const product = await productService.getProductById(pid)

            await commentService.updateComment(cid, {body, rating})

            const comments = await commentService.getAllComments(pid),
                productRating = comments.reduce((prev, current)=> prev + current.rating, 0) / comments.length

            await productService.updateRating(pid, productRating)

            comment = {...comment, body, rating}
            res.status(200).send({comment})
            
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async remove(req, res){
        try {
            const {user} = req,
                {pid, cid} = req.params

            const comment = await commentService.getCommentById(cid)
            if (comment.uid !== user.uid && !user.admin) throw {code:401, message:'Você não tem permissão para isso'}

            const product = await productService.getProductById(pid)

            await commentService.deleteComment(cid)

            const comments = await commentService.getAllComments(pid),
                productRating = comments.reduce((prev, current)=> prev + current.rating, 0) / comments.length

            await productService.updateRating(pid, productRating)

            res.status(204).send()
            
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
}