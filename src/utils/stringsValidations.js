const stringsValidations = class stringsValidations {
    static async notBlank(str) {
        try {
            if (!str || str.trim().length === 0) throw { code: 400, message: 'Campo não pode estar vazio' };
            return true;
        } catch (err) {
            throw err;
        }
    }

    static async validateName(name) {
        try {
            await this.notBlank(name);
            if (name.length < 3 || name.length > 50) throw { code: 400, message: 'O nome deve ter entre 3 e 50 caracteres' };
            return true;
        } catch (err) {
            throw err;
        }
    }

    static async validateEmail(email) {
        try {
            await this.notBlank(email);
            const emailRegex = /^[\w\d.!#$%&'+/=?^_`{|}~-]+@[\w\d-]+(?:\.[\w\d-]+)+$/;
            if (!email.match(emailRegex)) throw { code: 400, message: 'Formato de e-mail inválido' };
            return true;
        } catch (err) {
            throw err;
        }
    }

    static async validatePassword(password) {
        try {
            await this.notBlank(password);
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&.]{6,}$/;
            if (!password.match(passwordRegex)) throw { code: 400, message: 'A senha deve conter pelo menos 6 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial' };
            return true;
        } catch (err) {
            throw err;
        }
    }

    static async validateDescription(description) {
        try {
            await this.notBlank(description);
            if (description.length > 60) throw { code: 400, message: 'A descrição deve ter no máximo 60 caracteres' };
            return true;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = stringsValidations;