const express = require('express'),
    cors = require('cors'),
    app = express(),
    routes = require('./routes/routes')

app.use(cors({origin:'*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization']}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/', routes)

module.exports = app