const multer = require('multer')

const userStorage = multer.memoryStorage()

module.exports = {
    userStorage
}