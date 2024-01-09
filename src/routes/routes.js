/* 
    This is a route function
    containing route to main components
    of the payment system
*/
const express = require("express")
const router = express.Router()
const controller = require('../controllers/controllers.js')
const dataParser = require('body-parser')
const multer = require('multer');
const fs = require('fs')
router.use(dataParser.json({extended:true}))
const path = __dirname.substring(0, __dirname.indexOf("src")) + "/web/"
router.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//creating multer middleware
const uploadImages = multer({
    storage:multer.memoryStorage()
})


router.post('/login', controller.login)
router.post('/getalllogins', controller.getUsers)
router.post('/getadmin', controller.getAdmin)
router.post('/modifyadmin', controller.modifyuser)
router.post('/addbook', uploadImages.single('photo'), controller.addBook)
router.post('/removebook', controller.removeBook)


//listen to 404 request
router.get("*", (req, res) =>{
    let tm = req.url
    console.log(tm)
    if(tm.indexOf('.html') > -1 && tm.indexOf('?') > -1) {
        tm = tm.substring(0, req.url.indexOf("?"))
    }
    if(fs.existsSync(path + tm)){
        res.sendFile(path + tm)
    }
    else{
        res.status(404).json({
            success: false,
            message: "Page not found",
            error: {
                statusCode: 404,
                message:
                    "You are trying to access a route that is not defined on this server."
            }
        })
    }
})

//exports router
module.exports = router
 
