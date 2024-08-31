const bcrypt = require('bcrypt')
const rounds = process.env.SALT_ROUNDS

module.exports = class bcryptFuncions{
    static async createHash(str){
        try {
            const salt = await this.generateSalt()
            return await bcrypt.hash(str, salt)
        } catch (err) {
            throw err
        }
    }
    static async generateSalt(){
        try {
            return await bcrypt.genSalt(Number(rounds))
        } catch (err) {
            throw err
        }
    }
    static async compareHash(str, hash){
        try {
            return new Promise(async(resolve, reject) => {
                const equal = await bcrypt.compare(str, hash)
                
                if(!equal) return reject({code:400, message:'Senha incorreta'})
                return resolve(equal)
            })
        } catch (err) {
            throw err
        }
    }
}