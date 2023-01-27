const express = require('express')
const app = express()
var port = process.env.PORT || 8081;
const http = require('http').Server(app).listen(port)
const cors = require('cors')
app.use(cors())
app.use(express.static('static'))
app.use(express.urlencoded({extended:false}))
const MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

const mongourl = "mongodb+srv://karniko1:karniko1@cps-595-p1.n8rfp91.mongodb.net/CPS595-Project?retryWrites=true&w=majority";



const dbClient = new MongoClient(mongourl,
                    {useNewUrlParser: true, useUnifiedTopology: true});
dbClient.connect(err => {
    if (err) throw err;
    console.log("Connected to the MongoDB cluster ");
});

app.get("/",(req,res) =>{
    res.send("LoginSignup microservice by Omkar Sunil Karnik")
})

app.get("/Login/:email/:password",(req,res)=> {
    var checkData = checklogindata(req.params)
    if (checkData.status =="passed"){
        console.log(req.params.email,req.params.password) 
        const db = dbClient.db();
        db.collection("users").findOne({email: req.params.email, password: req.params.password}, (err, userdata) => {
        console.log(userdata,"Userdata")
        if (err){
            return res.send({message:"Error in Microservice !",status: "authentication-failed"})
        }
        if  (userdata){
            console.log(userdata);
            return res.send({userdata:userdata, status : "authenticated"});
            console.log(userdata)
        }
        else {
            return res.send({message:"User Not Found !",status: "authentication-failed"})
        }
    });
    }
    else{
        return res.send({message:checkData.message,status:"authentication-failed"})

    }
    
})

app.post("/SignUp", jsonParser, (req,res)=>{
    var checkData = checkuserdata(req.body)
    if (checkData.status =="passed"){
        console.log('in signup', req.body)
        const db = dbClient.db();
        db.collection("Users").findOne({ $or: [{email: req.body.email} , {username: req.body.username}]}, (err, userdata) => {
                if  (userdata){
    
                    return res.send({message:"User Already Exist",status:"registeration-failed"});
                }
                else {
                    db.collection("Users").insertOne({fullname: req.body.fullname ,email: req.body.email, username: req.body.username, password: req.body.password}, (err, userdata) => {
                        console.log(userdata,"Userdata")
                            if  (err){
                                
                                return res.send({message:"Something Went wrong. Please try again later !",status:"registeration-failed"});
                            }
                            else {
                                return res.send({message:"Signup Successfull !", status:"registeration-successfull", userdata:req.body})
                            }
                        });
                }
            });
    }
    else{
        res.send({message:checkData.message,status:"registeration-failed"})
    }
    
})
function checklogindata(user){
    // if (!user.username){
    //     return {status:"failed",message:"no username !"}
    // }
    if (!user.password){
        return {status:"failed",message:"no password !"}
    }
    // if (user.username.length < 4 || user.username.length > 20){
    //     return {status:"failed",message:"username should be between 4 and 20 !"}
    // } 
    
    if (user.password.length < 6 || user.password.length > 20){
        return {status:"failed",message:"password should be between 6 and 20  !"}
    }
    return {status: 'passed'}
}   
function checkuserdata(user){
    // if (!user.username){
    //     return {status:"failed",message:"no username !"}
    // }
    if (!user.email){
        return {status:"failed",message:"no email !"}
    }
    // if (!user.fullname){
    //     return {status:"failed",message:"no name !"}
    // }
    if (!user.password){
        return {status:"failed",message:"no password !"}
    }
    // if (user.username.length < 4 || user.username.length > 20){
    //     return {status:"failed",message:"username should be between 4 and 20 !"}
    // }
    // if (user.password.length < 6 || user.password.length > 20){
    //     return {status:"failed",message:"password should be between 6 and 20 !"}
    // }
    if (ValidateEmail(user.email) != true){
        return {status:"failed",message:"invalid email !"}
    }
    return {status: 'passed'}
}

function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        return (true)
    }        return (false)
}