const numberValidations = class numberValidations{
    static async verifyPrice (price){
        try {
            if (isNaN(price)) throw {code:400, message: 'Insira um número'}
            if (price < 0) throw {code: 400, message: 'Preço inválido'}
            if (price > 1000000) throw {code:400, message: 'Ninguem vai comprar esse produto'}
            return true
        } catch (err) {
            throw err
        }
    }
    static async verifyRating (rating){
        try {
            if (isNaN(rating)) throw {code:400, message: 'Insira um número'}
            if (rating < 0 || rating > 5) throw {code: 400, message: 'Feedback inválido'}
            return true
        } catch (err) {
            throw err
        }
    }
}

module.exports = numberValidations