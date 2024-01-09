//controllers functions
const userDb = require('../models/models.js').userDb;
const loginDb = require('../models/models.js').loginDb;
const crypto = require('crypto')
const fs = require('fs')
const uuid = require('uuid');

let SESSIONS = [] //stores user session

//to save user
const newuser = (params) => {
    //create new wallet address
    try{    
        if(params.name && params.pass){  
            //does not exists, create one
            userDb.create((stat, id)=>{
                if(stat) {  
                    //successfull
                    console.log('success')
                }
                else {
                    console.log({status:false, msg:'Something went wrong'})
                }
            }, {pass: params.pass, name:params.name})
    
        }
        else{return({status:'error', msg:'Name, Password '})}
    }
    catch(e){console.log(e);return({status:'error',  msg:'Internal server error'})}    
}  
//console.log(newuser({name:'admin',pass:'0000'}))
//to login
exports.login = (req, res) => {
    //create new wallet address
    try{   
        req = req.body;
        if(req.name && req.pass){ 
            userDb.get(req.name, (_stat, dat) => {
                if(_stat.status === true) {  
                    //get password
                     req.pass = crypto.createHash('sha1').update(req.pass).digest('hex')
                     if(dat.pass == req.pass) {
                        //save browser fingerprint in session
                        SESSIONS[dat.id] = dat.name
                        //check if user has registered fingerprint
                        res.send(JSON.stringify({status:true, id:dat.id}))
                     }
                     else {
                        res.send(JSON.stringify({status:false, msg:'Password don"t match'}))
                     }
                }
                else {
                    //does not exists,  
                    res.send(JSON.stringify({status:false, msg:'User does not exists'}))
                }
            })
        }
        else{res.send(JSON.stringify({status:'error', msg:'username or password not provided'}))}
    }
    catch(e){console.log(e);res.send(JSON.stringify({status:'error',  msg:'Internal server error'}))}    
} 
//to log out
exports.logout = (req, res) => {
    //create new wallet address
    try{   
        req = req.body;
        if(req.id){ 
            SESSIONS[req.id] = null
            res.send({status:true})
        }
        else{res.send({status:'error', msg:'session id provided'})}
    }
    catch(e){console.log(e);res.send({status:'error',  msg:'Internal server error'})}    
}
//to modify a user personal data
exports.modifyuser = (req, res) => {
    //create new wallet address
    try{   
        req = req.body;
        if(req.id){ 
            isLogin(res,req.id, (username) => {
                userDb.getId(req.id, (_stat) => {
                    if(_stat.status === true) {  
                        req.data = req.data || {}
                        req.data.id = req.id
                        userDb.save((stat)=>{
                            if(stat) { 
                                //successfull
                                res.send({status:true})
                            }
                            else {
                                res.send({status:false, msg:'Something went wrong'})
                            }
                        }, req.data)
                    }
                    else {
                        //does not exists,  
                        res.send({status:false, msg:'User does not exists'})
                    }
                })
            })
        }
        else{res.send({status:'error', msg:'session is not provided'})}
    }
    catch(e){console.log(e);res.send({status:'error',  msg:'Internal server error'})}    
}
//to return users from waitlist
exports.getAdmin = (req, res) => {
    //create new wallet address
    try{    
        req = req.body
        isLogin(res,req.id, (username) => {
            userDb.getId(req.id, (_stat, dat) => {
                if(_stat.status === true) {  
                   res.send({status:true, dat})
                }
                else {
                    //does not exists,  
                    res.send(JSON.stringify({status:false, msg:'User does not exists'}))
                }
            })
        })
     }
    catch(e){console.log(e);res.send({status:'error',  msg:'Internal server error'})}    
}
//to return users from waitlist
exports.getUsers = (req, res) => {
    //create new wallet address
    try{    
        req = req.body
        isLogin(res,req.id, (username) => {
            loginDb.getAll((_stat) => {  
                    if(_stat.status === true) {  
                        //check if it has register print already
                        res.send({status:true, data:_stat.data})
                    }
                    else {
                        res.send({status:true, data:[]})
                    }
                })
        })
     }
    catch(e){console.log(e);res.send({status:'error',  msg:'Internal server error'})}    
}
//to save user to waitlist
exports.addBook = (req, res) => {
    //create new wallet address
    try{    
        //upload the file
        const mime = req.file.mimetype
        const buffer = req.file.buffer
        req = req.body;
        if(req.name && req.url){  
            let id = uuid.v4()
            if(mime.indexOf('image') > -1) {
                const fileName = id + '.png'
                const dest = 'web/img/' + fileName
                fs.writeFileSync(dest, buffer)
                loginDb.create((stat, id)=>{
                    if(stat) {  
                        //successfull
                        res.send(`
                            <script>
                                alert('Added successfully');
                                window.location = 'addbook.html'
                            </script>
                        `)
                    }
                    else {
                        res.send(`
                        <script>
                            alert('Something went wrong');
                            window.location = 'addbook.html'
                        </script>
                    `)
                    }
                }, {id:id, name:req.name, url:req.url, price:req.price, currency:req.currency, author:req.author, img:fileName})
            }
            else {
                res.send(res.send(`
                <script>
                    alert('Send image file');
                    window.location = 'addbook.html'
                </script>
            `))
            }
        }
        else{res.send({status:'error', msg:'No data provided'})}
    }
    catch(e){console.log(e);res.send({status:'error',  msg:'Internal server error'})}    
}
//to save user to waitlist
exports.removeBook = (req, res) => {
    //create new wallet address
    try{    
        //upload the file
        req = req.body;
        if(req.id){  
            loginDb.delete((stat)=>{
                if(stat.status == true) {  
                    //successfull
                    const fileName = req.id + '.png'
                    const dest = 'web/img/' + fileName
                    if(fs.existsSync(dest)) {
                        fs.unlinkSync(dest)
                    }
                    res.send({status:true})
                }
                else {
                    res.send({status:false})
                }
            }, req.id)
       
        }
        else{res.send({status:'error', msg:'No data provided'})}
    }
    catch(e){console.log(e);res.send({status:'error',  msg:'Internal server error'})}    
}
function isLogin(res, session_id, callback) {
    const username = SESSIONS[session_id];
    if(username == undefined || username == null){
        //this id has not login
        res.send({status:false, msg: 'invalid session'})
        return;
    }
    else callback(username)
}
 
  
