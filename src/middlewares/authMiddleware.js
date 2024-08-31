const {decodeToken} = require('../utils/jwtFunctions')

const authMiddleware = new class authMiddleware{
    async auth(req, res, next){
        try {
            const authorization = req.headers['authorization']
            if ( !authorization ) throw {code:401, message:'Token não enviado'}

            const [_, token] = authorization.split(' ')
            if ( !token ) throw {code:401, message:'Token não enviado'}

            const userDecoded = await decodeToken(token)

            req.user = userDecoded
            next()
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 403,
                message = err?.message ?? 'Token inválido'
            res.status(code).send({message}) 
        }
    }
    async authAdmin(req, res, next){
        try {
            const authorization = req.headers['authorization']
            if ( !authorization ) throw {code:401, message:'Token não enviado'}

            const [_, token] = authorization.split(' ')
            if ( !token ) throw {code:401, message:'Token não enviado'}

            const userDecoded = await decodeToken(token)

            if(!userDecoded.admin) throw {code:401, message:'Usuário não tem permissão'}

            req.user = userDecoded
            next()
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 403,
                message = err?.message ?? 'Token inválido'
            res.status(code).send({message}) 
        }
    }
}

module.exports = authMiddleware