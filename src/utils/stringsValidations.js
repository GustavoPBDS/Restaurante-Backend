const stringsValidations = class stringsValidations{
    static async notBlank(str){
        return new Promise((resolve, reject) => {
            return (!str.length == 0 || !str.trim().length == 0) ? resolve(true) : reject(false)
        })
    }
    static async validateName (name){
        try {
            await this.notBlank(name)

            return new Promise((resolve, reject) => {
                return name.length >= 3 ? resolve(true) : reject(false)
            })
        } catch (err) {
            throw err
        }
    }
    static async validateEmail(email){
        try {
            await this.notBlank(email)

            const emailRegex = /^[\w\d.!#$%&'+/=?^_`{|}~-]+@[\w\d-]+(?:\.[\w\d-]+)+$/
            return new Promise((resolve, reject) => {
                return email.match(emailRegex) ? resolve(true) : reject(false)
            })
        } catch (err) {
            throw err
        }
    }
    static async validatePassword(password){
        try {
            await this.notBlank(password)

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
            return new Promise((resolve, reject) => {
                return password.match(passwordRegex) ? resolve(true) : reject(false)
            })
            
        } catch (err) {
            throw err
        }
    }
}

module.exports = stringsValidations