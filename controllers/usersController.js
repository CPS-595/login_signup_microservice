const e = require('express');
const EncryptedPassword = require('../model/EncryptedPassword');
const User = require('../model/User');

function validateResource(data){
    if (!data.userId) return { status: 'Failed', message: 'Name is required' };      
    if (!data.credentialId) return { status: 'Failed', message: 'Username is required' };
    if (!data.password) return { status: 'Failed', message: 'password is required' };
    return { status:'success'}

}

const getAllUsers = async(req, res) => {

    const userData =  await User.find({ _id: { $ne: req.user._id  }}).exec();
    let users = [];
    userData.map(obj => { 
        if (obj.publicKey) {
            users.push({
                "id":obj._id,
                "name": obj.name,
                "email": obj.email,
                "publicKey":obj.publicKey
            })
        }
    });
    return res.status(200).json({ status: 'Success', payload: users });
   

}

const storePublicKey = (req, res) => {
    console.log("body", req.body)
    const publicKey = req.body.publicKey;
    var query = { _id : req.user._id};
    User.findOneAndUpdate(query, {publicKey: publicKey}, {upsert: true}, function(err, result) {
        console.log("result", result)
        if (err) return res.status(400).json({status: "Failed", error: err});
        return res.status(200).json({status:"Success", payload: "Saved Successfully"});
    });
}

const storeCredential = async (req,res) => {
    console.log("in storecredential", req.body);

    const checkResource = validateResource(req.body);
    if (checkResource.status === "success") {

        EncryptedPassword.create({
            "userId": req.body.userId,
            "credentialId": req.body.credentialId,
            "password": req.body.password,
        }, function(err, result) {
            console.log("result", result)
            if (err) return res.status(400).json({status: "Failed", error: err});
            return res.status(201).json({ status: 'Success', payload: result });
        })
    }
    else {
        return res.status(400).json(checkResource);
    }
    
}

module.exports = {
    getAllUsers,
    storePublicKey,
    storeCredential,
}