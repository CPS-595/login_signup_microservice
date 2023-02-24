require('dotenv').config();
const express = require('express')
const app = express()
var port = process.env.PORT || 8081;
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

connectDB();

// const http = require('http').Server(app).listen(port, () => {
//     console.log(`Server running on port ${port}`)
// })

const cors = require('cors')
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// app.use(cors())
// app.use(express.static('static'))
app.use(express.urlencoded({extended:false}))
// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

const MongoClient = require('mongodb').MongoClient;
// var bodyParser = require('body-parser')
// var jsonParser = bodyParser.json();

// MongoDB url which allows connection to be established with our application
// const mongourl = "mongodb+srv://karniko1:karniko1@cps-595-p1.n8rfp91.mongodb.net/CPS595-Project?retryWrites=true&w=majority";

// const dbClient = new MongoClient(mongourl,
//                     {useNewUrlParser: true, useUnifiedTopology: true});

// dbClient.connect(err => {
//     if (err) throw err;
//     console.log("Connected to the MongoDB cluster!");
// });

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Default route
app.get("/",(req,res) =>{
    res.send("LoginSignup microservice by Omkar Sunil Karnik")
})



// app.post("/Login/:username/:password", jsonParser, (req,res)=> {
//     var checkData = checklogindata(req.params)
//     if (checkData.status =="passed"){
//         console.log(req.params.username,req.params.password) 
//         const db = dbClient.db();
//         db.collection("Users").findOne({username: req.params.username, password: req.params.password}, (err, userdata) => {
//         console.log(userdata,"Userdata")
//         if (err){
//             return res.send({message:"Error in Microservice !",status: "authentication-failed"})
//         }
//         if  (userdata){
//             console.log(userdata);
//             return res.send({userdata:userdata, status : "authenticated"});
//             console.log(userdata)
//         }
//         else {
//             return res.send({message:"User Not Found !",status: "authentication-failed"})
//         }
//     });
//     }
//     else{
//         return res.send({message:checkData.message,status:"authentication-failed"})

//     }
    
// })

// Login route to which makes post request and checks the data with the database collection
    
app.post("/login", (req,res)=>{
    console.log("inside login",req.body)
    var checkData = checklogindata(req.body)
    if (checkData.status =="passed"){
        console.log('in login', req.body)
        const db = dbClient.db();
        db.collection("users").findOne({email: req.body.email, password: req.body.password}, (err, userdata) => {
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

app.post("/signup", (req,res)=>{
    var checkData = checkuserdata(req.body)
    if (checkData.status =="passed"){
        console.log('in signup', req.body)
        const db = dbClient.db();
        db.collection("users").findOne({ $or: [{email: req.body.email} , {number: req.body.number}]}, (err, userdata) => {
                if  (userdata){
    
                    return res.send({message:"User Already Exist",status:"registeration-failed"});
                }
                else {
                    db.collection("users").insertOne({email: req.body.email, password: req.body.password, number: req.body.number}, (err, userdata) => {
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
    if (!user.email){
        return {status:"failed",message:"no username !"}
    }
    if (ValidateEmail(user.email) != true){
        return {status:"failed",message:"invalid email !"}
    }
    if (!user.password){
        return {status:"failed",message:"no password !"}
    }

    if (user.password.length < 6 || user.password.length > 20){
        return {status:"failed",message:"password should be between 6 and 20  !"}
    }
    return {status: 'passed'}
}   

function checkuserdata(user){
    
    if (!user.email){
        return {status:"failed",message:"no email !"}
    }
    if (!user.password){
        return {status:"failed",message:"no password !"}
    }
    if (!user.number){
        return {status:"failed",message:"no number !"}
    }
    if (isValid_Mobile_Number(user.number) != true){
        return {status:"failed",message:"invalid email !"}
    }

   
    if (user.password.length < 6 || user.password.length > 20){
        return {status:"failed",message:"password should be between 6 and 20 !"}
    }
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

function isValid_Mobile_Number(mobile_number) {
    // Regex to check valid
    // mobile_number 
    let regex = new RegExp(/[6-9][0-9]{9}/);
 
    // if mobile_number
    // is empty return false
    if (mobile_number == null) {
        return "false";
    }
    
    return regex.test(mobile_number);
    
}

app.get("/echo", (req,res)=> {
    console.log("in echo")
    return res.send({message: "response received from server"})
})

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/resources', require('./routes/resources'));
app.use('/users', require('./routes/users'));

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`Server running on port ${port}`));
});