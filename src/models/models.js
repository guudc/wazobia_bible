/* 
    This is a model function
    containing models to main components
    of the nptr payment system
*/

//Import the mongoose module
const mongoose = require('mongoose');
const crypto = require('crypto')
const schema = mongoose.Schema 
const uuid = require('uuid');

//Set up default mongoose connection
const mongoDB = 'mongodb+srv://Indo:AyDUGCFq1lH1Vri6@cluster0.1o3kiu8.mongodb.net/Indo';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
console.log("Connected")

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const ver = 'v2'
//creating Wallet database class
class _Wallet{
    /*
        This class controls the wallet
        model database connection
    */
    model = null;
    constructor(){
        //initialize database schema
        this.model = mongoose.model('bible_admin_' + ver, (new schema({
            id:String, pass:String, name:String
        })))
    }

    create(func, params){
      /*
        This functions create a new wallet
        data and store in the database
        It returns the wallet Id
      */
       //create id
       const id = uuid.v4()
       let mData = {id:id, name: params.name, pass: crypto.createHash('sha1').update(params.pass).digest('hex')}
       new this.model(mData)
       .save((err) =>{
           if(err) func({status:'error',msg:'Internal database error'})
           func({status:true}, id) 
       })
     }
    get(id, func){
      /*
        This functions get a wallet
        data and store in the database
        It returns the wallet Json data
      */
          if(id){
           //find the request dat
            this.model.find({'name':id},(err, res) =>{
                if(err) func({status:'error',msg:'Internal database error'})
                if(res != null){  
                     if(res.length > 0){
                        res = res[0]
                        let p = {
                            id:res.id,name:res.name,pass: res.pass
                        }
                        func({status:true}, p)
                     }
                    else{func({status:'error',msg:'No wallet id found'})}
                }
                else{func({status:'error',msg:'No wallet id found'})}
           })
           
       }
       else{
           //no request id found
           func({status:'error',msg:'No wallet id found'})
       }
    }
    getId(id, func){
        /*
          This functions get a wallet
          data and store in the database
          It returns the wallet Json data
        */
            if(id){
             //find the request dat
              this.model.find({'id':id},(err, res) =>{
                  if(err) func({status:'error',msg:'Internal database error'})
                  if(res != null){  
                       if(res.length > 0){
                          res = res[0]
                          let p = {
                              id:res.id,name:res.name,pass: res.pass
                          }
                          func({status:true}, p)
                       }
                      else{func({status:'error',msg:'No wallet id found'})}
                  }
                  else{func({status:'error',msg:'No wallet id found'})}
             })
             
         }
         else{
             //no request id found
             func({status:'error',msg:'No wallet id found'})
         }
      }
    getAll(num,func){
        /*
          This functions get list of wallet taht have not been airdrop
          data and store in the database
          It returns the wallet Json data
        */
        this.model.find({'status':'empty'}, (err, res) =>{
                  if(err) func({status:'error',msg:'Internal database error'})
                  if(res != null){  
                       if(res.length > 0){
                          func({status:true, data:res})
                       }
                      else{func({status:'error',msg:'No wallet id found'})}
                  }
                  else{func({status:'error',msg:'No wallet id found'})}
        }).limit(num)
      }
    save(func, params){
        /*
         This functions saves or modify a proposal
         data and store in the database
         It returns either true|false|null
       */ 
        //get the specified request from database
        if(params.id != undefined && params.id != null){
             //first find the proposal
            this.model.find({'id':params.id},(err, res) =>{
                if(err) func({status:'error',msg:'Internal database error'})
                if(res != null){//console.log(res)
                     if(res.length > 0){ 
                        res = res[0]
                        if(params.name || res.name){
                            res.name = params.name 
                        }
                        if(params.pass || res.pass){
                            res.pass = crypto.createHash('sha1').update(params.pass).digest('hex')
                        }
                        const p = res; //console.log(params)
                        this.model.findOneAndUpdate({'id':params.id}, p,{new:true}, (err, res) =>{
                            if(err) func({status:'error',msg:'Internal database error'})
                            if(res != null){
                                func({status:true})
                            }                         
                       })
                     }
                    else{func({status:'error',msg:'No wallet with id found'})}
                }
                else{func({status:'error',msg:'No wallet with id found'})}
           })
            
        }
        else{
            //no request id found
            func({status:'error',msg:'No wallet id found'})
        }
     }
    
}

class _login{
    /*
        This class controls the wallet
        model database connection
    */
    model = null;
    constructor(){
        //initialize database schema
        this.model = mongoose.model('bibleapp_login_' + ver, (new schema({
            id:String, name:String, url:String, date:String, price:String, author:String, img:String, currency:String
        })))
    }

    create(func, params){
      /*
        This functions create a new wallet
        data and store in the database
        It returns the wallet Id
      */
       //create id
       let mData = {id:params.id, name: params.name, url:params.url, date:((new Date(Date.now())) + ""),
       price:params.price, author:params.author, img:params.img, currency:params.currency}
       new this.model(mData)
       .save((err) =>{
           if(err) func({status:'error',msg:'Internal database error'})
           func({status:true}, params.id) 
       })
     }
    get(id, func){
      /*
        This functions get a wallet
        data and store in the database
        It returns the wallet Json data
      */
          if(id){
           //find the request dat
            this.model.find({'id':id},(err, res) =>{
                if(err) func({status:'error',msg:'Internal database error'})
                if(res != null){  
                     if(res.length > 0){
                        res = res[0]
                        let p = {id:res.id, name: res.name, url:res.url, date:res.date,
                        price:res.price, author:res.author, currency:res.currency, img:res.img}
                        func({status:true}, p)
                     }
                    else{func({status:'error',msg:'No wallet id found'})}
                }
                else{func({status:'error',msg:'No wallet id found'})}
           })
           
       }
       else{
           //no request id found
           func({status:'error',msg:'No wallet id found'})
       }
    }
    getAll(func){
        /*
          This functions get list of wallet taht have not been airdrop
          data and store in the database
          It returns the wallet Json data
        */
        this.model.find({'status':'empty'}, (err, res) =>{
                  if(err) func({status:'error',msg:'Internal database error'})
                  if(res != null){  
                       if(res.length > 0){
                          func({status:true, data:res})
                       }
                      else{func({status:'error',msg:'No wallet id found'})}
                  }
                  else{func({status:'error',msg:'No wallet id found'})}
        }) 
      }
    save(func, params){
        /*
         This functions saves or modify a proposal
         data and store in the database
         It returns either true|false|null
       */ 
        //get the specified request from database
        if(params.id != undefined && params.id != null){
             //first find the proposal
            this.model.find({'id':params.id},(err, res) =>{
                if(err) func({status:'error',msg:'Internal database error'})
                if(res != null){//console.log(res)
                     if(res.length > 0){ 
                        res = res[0]
                        if(params.name || res.name){
                            res.name = params.name 
                        }
                        if(params.url || res.url){
                            res.url = params.url 
                        }
                        if(params.price || res.price){
                            res.price = params.price 
                        }
                        if(params.currency || res.currency){
                            res.currency = params.currency 
                        }
                        if(params.img || res.img){
                            res.img = params.img 
                        }
                        if(params.author || res.author){
                            res.author = params.author 
                        }
                        const p = res; //console.log(params)
                        this.model.findOneAndUpdate({'id':params.id}, p,{new:true}, (err, res) =>{
                            if(err) func({status:'error',msg:'Internal database error'})
                            if(res != null){
                                func({status:true})
                            }                         
                       })
                     }
                    else{func({status:'error',msg:'No wallet with id found'})}
                }
                else{func({status:'error',msg:'No wallet with id found'})}
           })
            
        }
        else{
            //no request id found
            func({status:'error',msg:'No wallet id found'})
        }
    }
    
    delete(func, id) {
        if(id) {
            this.model.deleteOne({'id':id}, (err, result) => {
                if (err) {
                    func({status:false})
                } else {
                    func({status:true})
                }
            });
        }
    }
}
 
//exports modules
exports.userDb =  new _Wallet();
exports.loginDb = new _login(); 