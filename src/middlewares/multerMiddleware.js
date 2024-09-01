const multer = require('multer'),
    {memoryStorage} = require('../config/multerConfig')

const multerMiddleware = new class multerMiddleware{
    uploadImage = multer({
        storage:memoryStorage,
        limits:{fileSize: 30 * 1024 * 1024},
        fileFilter: (req, file, cb)=>{
            if(!file.mimetype.match(/image\/*/)) return cb(null, false)
            return cb(null, true)
        }
    }).single('image')
}

module.exports = multerMiddleware