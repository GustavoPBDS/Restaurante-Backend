const uuid = require('uuid')
module.exports = function createUUID() {
    return uuid.v4()
}