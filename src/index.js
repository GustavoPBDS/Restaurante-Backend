require('dotenv').config()
const app = require('./app'),
    port = process.env.PORT,
    {createDatabase} = require('./database/index'),
    userTable = require('./models/userModel'),
    productTable = require('./models/productModel'),
    orderTable = require('./models/orderModel'),
    orderItemTable = require('./models/orderItemModel'),
    commentTable = require('./models/commentModel');

(async ()=>{
    try {
        await createDatabase()

        await userTable()
        await productTable()
        await orderTable()
        await orderItemTable()
        await commentTable()
    } catch (err) {
        console.log(err)
        process.exit(1)
    }  
})()

app.listen(port,()=>console.log(`http://localhost:${port}/`))