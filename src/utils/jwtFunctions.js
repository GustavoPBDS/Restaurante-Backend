const jwtwebtoken = require('jsonwebtoken'),
    expiresIn = '7d',
    jwtKey = process.env.JWT_SECRET

module.exports = new class{
    async createToken (data){
        return new Promise((resolve, reject) => {
            jwtwebtoken.sign(data, jwtKey, {expiresIn}, (err, token)=>{
                return err ? reject(err) : resolve(token)
            })
        })
    }
    async decodeToken(token){
        return new Promise((resolve, reject) => {
            jwtwebtoken.verify(token, jwtKey, (err, dataDecoded)=>{
                return err ? reject(err) : resolve(dataDecoded)
            })
        })
    }
}