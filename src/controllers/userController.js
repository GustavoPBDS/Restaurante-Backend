const userService = require('../services/userService')
const userRepositorie = require('../repositories/userRepositorie')
const {createToken} = require('../utils/jwtFunctions')
const {createFileImage, deleteFileImage, getImagePath} = require('../utils/imageFunctions')

const path = require('path')
const fs = require('fs')
const port = process.env.PORT

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
            const user = JSON.parse(req.body.user)

            if (!user) throw {code:400, message:'Requisição inválida'}
            if (!user.name || !user.email || !user.password) throw {code:400, message:'Preencha todos os campos'}
            
            if (await userService.getUserByEmailPrivate(user.email)) throw {code:409, message:'Esse email ja está cadastrado no sistema'}

            let profileImg = 'default',
                filename, filePath

            if (req.file) {
                filename = `${Date.now()}_${req.file.originalname}`
                filePath = path.join('public/userImages', filename)
                profileImg = `http://localhost:${port}/${filePath}`
            }

            let User = await userService.createUser({...user, profileImg}),
                hash = await userService.generatePasswordHash(user.password)
            User.password = hash

            await userRepositorie.create(User)

            const publicUser = {...User}
            delete publicUser.password
        
            const token = await createToken(publicUser)

            if (req.file) createFileImage(filePath, req.file.buffer)

            res.status(201).send({token})
        } catch (err) {
            console.log(err)
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
    async remove(req, res){
        try {
            const {user} = req
            const uid = req.params.uid ?? null

            if (!user) throw {code:406, message:'Usuario não informado'}
            if (uid && !user.admin) throw {code: 401, message: "Você não tem permissão para apagar esse usuario"}

            await userService.deleteUser(uid ? uid : user.uid)
            
            res.status(204).send()
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message}) 
        }
    }
    async update(req, res){
        try {
            let userAuth = req.user
            let userEdit = JSON.parse(req.body.user)
            const uid = req.params.uid ?? null 

            if (!userAuth) throw {code:406, message:'Usuario não informado'}
            if (uid && !userAuth.admin) throw {code: 401, message: "Você não tem permissão para editar outro usuario"}

            if (userAuth.admin && !uid) throw {code: 403, message: "Admin não pode ser editado"}

            if (uid && userAuth.admin) userAuth = await userService.getUserById(uid)

            await userService.verifyUserObject(userEdit)

            let profileImg = userAuth.profileImg,
                filename, filePath, previusPath

            if (req.file) {
                filename = `${Date.now()}_${req.file.originalname}`
                filePath = path.join('public/userImages', filename)
                previusPath = getImagePath(profileImg)
                profileImg = `http://localhost:${port}/${filePath}`
            }
            userEdit = {...userEdit, profileImg}
            let User = {...userAuth, ...userEdit}
            delete User.iat
            delete User.exp
            
            await userRepositorie.update(User)
            const token = await createToken(User)

            if (req.file) {
                if (profileImg !== "default") await deleteFileImage(previusPath)
                createFileImage(filePath, req.file.buffer)
            }

            res.status(201).send({token})
        } catch (err) {
            console.log(err)
            let code = err?.code ?? 500,
                message = err?.message ?? 'Ocorreu um erro'
            res.status(code).send({message}) 
        }
    }
}