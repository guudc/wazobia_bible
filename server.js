"use strict"

const express = require("express")
const route = require("./src/routes/routes.js") 
const app = express()

app.use("/", route)
//configuring the uploads
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb', extended:true}))

let port = process.env.PORT || 1000

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${port}`)
})


 
