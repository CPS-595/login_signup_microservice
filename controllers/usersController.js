const User = require('../model/User');

const getAllUsers = async(req, res) => {

    const userData =  await User.find({ _id: { $ne: req.user._id  }}).exec();
    let users = [];
    userData.map(obj => { 
        if (obj.publicKey) {
            users.push({
                "id":obj._id,
                "name": obj.name,
                "email": obj.email,
                "publickey":obj.publickey
            })
        }
    });
    return res.status(200).json({ status: 'Success', payload: users });
   

}

const storePublicKey = (req, res) => {
    const publicKey = req.body.publicKey;
    var query = { _id : req.user._id};
    User.findOneAndUpdate(query, {publicKey: publicKey}, {upsert: true}, function(err, result) {
        console.log("result", result)
        if (err) return res.status(400).json({status: "failed", error: err});
        return res.status(200).json({status:"Sucess", payload: "Saved Successfully"});
    });

}
module.exports = {
    getAllUsers,
    storePublicKey
}