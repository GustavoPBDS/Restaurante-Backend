const multer = require('multer'),
    {userStorage} = require('../config/multerConfig')

const multerMiddleware = new class multerMiddleware{
    uploadProfileImage = multer({
        storage:userStorage,
        limits:{fileSize: 11 * 1024 * 1024},
        fileFilter: (req, file, cb)=>{
            if(!file.mimetype.match(/image\/*/)) return cb(null, false)
            return cb(null, true)
        }
    }).single('profileImg')
}

module.exports = multerMiddleware