const password = process.env.PASSWORD_MYSQL
const mysql = require('mysql2')

const objectConnection = {
    password,
    user: 'root',
    host: "localhost"
},
objectDatabase = {
    client: 'mysql2',
    connection:{
        ...objectConnection,
        database: 'restaurante'
    }
}

const createDatabase = () =>{
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(objectConnection)
        connection.connect((err)=>{
            if (err) return reject(err)
            connection.query('CREATE DATABASE IF NOT EXISTS restaurante', (err)=>{
                connection.end()
                return err ? reject(err) : resolve()
            })
        }) 
    })
}


module.exports = {
    dev:{
        ...objectDatabase
    },
    createDatabase
}