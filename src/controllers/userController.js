const userService = require('../services/userService')
const userRepositorie = require('../repositories/userRepositorie')
const {createToken, decodeToken} = require('../utils/jwtFunctions')

module.exports = new class{
    async registerAdmin(req, res){
        try {
            const hasAdmin = await userService.getAdmin()
            if (hasAdmin) throw {code:409, message:'Já existe um admin'}

            const admin = await userService.createAdmin()
        
            const hash = await userService.generatePasswordHash(admin.password)
            admin.password = hash

            await userRepositorie.create(admin)

            const adminPublic = {...admin}
            delete adminPublic.password

            const token = await createToken(adminPublic)
            res.status(201).send({token})
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async register(req, res){
        try {
            const {user} = req.body

            if (!user) throw {code:400, message:'Requisição inválida'}
            if (!user.name || !user.email || !user.password) throw {code:400, message:'Preencha todos os campos'}
            
            if (await userService.getUserByEmailPrivate(user.email)) throw {code:409, message:'Esse email ja está cadastrado no sistema'}

            let User = await userService.createUser(user),
                hash = await userService.generatePasswordHash(user.password)
            User.password = hash

            await userRepositorie.create(User)

            const publicUser = {...User}
            delete publicUser.password
        
            const token = await createToken(publicUser)

            res.status(201).send({token})

        } catch (err) {
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async login(req, res){
        try {
            const {user} = req.body

            if (!user) throw {code:400, message:'Requisição inválida'}
            if (!user.email || !user.password) throw {code:400, message:'Preencha todos os campos'}
            
            await userService.verifyEmail(user.email)

            const UserPrivate = await userService.getUserByEmailPrivate(user.email)
            if (!UserPrivate) throw {code:400, message:'Email não cadastrado'}
            
            await userService.verifyPasswordHash(user.password, UserPrivate.password)

            const publicUser = {...UserPrivate}
            delete publicUser.password

            const token = await createToken(publicUser)
            res.status(200).send({token})
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message})
        }
    }
    async profile(req, res){
        try {
            const {user} = req
            if (!user) throw {code:406, message:'Usuario não informado'}
            res.status(200).send({user})

        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message}) 
        }
    }
    async getUser(req, res){
        try {
            const {uid} = req.params
            if(!uid) throw {code:406, message:'Id do usuario não informado'}

            const user = await userService.getUserById(uid)

            res.status(200).send({user})
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message}) 
        }
    }
    async getUsers(req, res){
        try {
            const {user} = req
            if (!user) throw {code:406, message:'Usuario não informado'}
            if (!user.admin) throw {code:403, message:'Usuario não tem permissão'}

            const users = await userService.getUsers()

            res.status(200).send({users})
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message}) 
        }
    }
}