const fs = require('fs')

module.exports = new class{
    createFileImage(filepath, buffer){
        fs.writeFileSync(filepath, buffer)
    }
    deleteFileImage(filepath){
        return new Promise((resolve, reject) => {
            if (fs.existsSync(filepath)){
                fs.unlink(filepath, (err)=>{
                    if (err) return reject({code:500, message:'Não foi possivel apagar imagem anterior'})
                    return resolve()
                })
            }else{
                return resolve()
            }
        })
    }
    getImagePath(imageUrl){
        const path = imageUrl.split('/public')[1]
        return `public${path}`
    }
}