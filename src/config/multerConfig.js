const multer = require('multer')

const memoryStorage = multer.memoryStorage()

module.exports = {
    memoryStorage
}