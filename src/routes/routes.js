const express = require('express'),
    router = express.Router()

router.use('/', (req, res)=>{
    res.send('Hello World!')
})

module.exports = router