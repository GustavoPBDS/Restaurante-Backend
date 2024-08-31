const stringsValidations = require('../utils/stringsValidations')
const bcryptFuncions = require('../utils/bcryptFuncions')
const userRepositorie = require('../repositories/userRepositorie')
const createUUID = require('../utils/createId')
const jwtFunctions = require('../utils/jwtFunctions')


module.exports = class User{
    constructor (uid, name, email, password, profileImg, admin){
        this.uid = uid
        this.name = name
        this.email = email
        this.password = password
        this.profileImg = profileImg
        this.admin = admin
    }

    static async createUser (userData) {
        try {
            const {name, email, password} = userData,
                profileImg = userData.profileImg ?? 'default',
                uid = userData.uid ?? createUUID()

            await this.verifyName(name)
            await this.verifyEmail(email)
            await this.verifyPassword(password)

            return new User(uid, name, email, password, profileImg, false)
        } catch (err) {
            throw err
        }
    }
    static async createAdmin (){
        try {
            const name = 'admin',
                email = 'admin',
                password = 'admin',
                profileImg = 'admin',
                uid = createUUID()
            return new User(uid, name, email, password, profileImg, true)
        } catch (err) {
            throw err
        }
    }

    //VERIFIES
    static async verifyName (name){
        try {
            return await stringsValidations.validateName(name)
        } catch (err) {
            throw {code:400, message:'Nome muito curto'}
        }
    }
    static async verifyEmail(email){
        try {
            return await stringsValidations.validateEmail(email)
        } catch (err) {
            throw {code:400, message:'Email inválido'}
        }
    }
    static async verifyPassword(password){
        try {
            return await stringsValidations.validatePassword(password)
        } catch (err) {
            throw {code:400, message:'Senha muito fraca'}
        }
    }
    static async verifyPasswordHash(password, hash){
        try {
            return await bcryptFuncions.compareHash(password, hash)
        } catch (err) {
            throw {code:400, message:'Senha incorreta'}
        }
    }

    //GETS
    static async getAdmin(){
        try {
            const res = await userRepositorie.getAdmin()
            return res
        } catch (err) {
            throw err
        }
    }
    static async getUserById(uid){
        try {
            const res = await userRepositorie.getUserById(uid)
            if (!res) throw {code:404, message:'Usuario não encontrado'}
            return res
        } catch (err) {
            throw err
        }
    }
    static async getUsers(){
        try {
            const res = await userRepositorie.getUsers()
            return res   
        } catch (err) {
            throw err
        }
    }
    static async getUserByEmailPublic(email){
        try {
            const res =  await userRepositorie.getUserByEmailPublic(email)
            if (!res) return null
            return res 
        } catch (err) {
            throw err
        }
    }
    static async getUserByEmailPrivate(email){
        try {
            const res =  await userRepositorie.getUserByEmailPrivate(email)
            if (!res) return null
            return res 
        } catch (err) {
            throw err
        }
    }
    
    // Bcrypt
    static async generatePasswordHash(password){
        try {
            return await bcryptFuncions.createHash(password)
        } catch (err) {
            throw err
        }
    }
    static async verifyPasswordHash(password, hash){
        try {
            return await bcryptFuncions.compareHash(password, hash)
        } catch (err) {
            throw err
        }
    }

}