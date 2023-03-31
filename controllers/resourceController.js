const Resource = require('../model/Resource');
const EncryptedPassword =  require('../model/EncryptedPassword')

const getAllResources = async(req, res) => {
    
    const resourceData = await Resource.find({createdBy:req.user._id}).exec();
    const encryptedPassword = await EncryptedPassword.find({userId:req.user._id})
    
    let resource = [];
    resource = resourceData.map(obj => {
        const index = encryptedPassword.findIndex(el => el["credentialId"].toString() == obj["_id"].toString());
        const { password } = index !== -1 ? encryptedPassword[index] : {};
        return {
            "name": obj.name,
            "username": obj.username,
            "password":password,
            "url": obj.url,
            "createdBy": obj.createdBy,
            "dateTime": obj.dateTime,
            "id":obj._id
        }
    });
    
    res.status(201).json({ status: 'Success', payload: resource });
}

const createResource = async (req, res) => {

    var checkResource = validateResource(req.body)
    if (checkResource.status === 'success'){

        let result = await Resource.create({
            "name": req.body.name,
            "username":req.body.username,
            "createdBy": req.user._id,
            "url": req.body.url
        });
    
        const password = await EncryptedPassword.create({
            "userId": req.user._id,
            "credentialId": result._id,
            "password": req.body.password

        });

        let payload = {
            "name": result.name,
            "url": result.url,
            "createdBy": result.createdBy,
            "_id": result._id,
            "dateTime": result.dateTime,
            "username":result.username,
            "password": password.password
        }
       
        

        console.log(result);
        console.log(password.password);
    
        return res.status(201).json({ status: 'Success', payload: payload });
    }
    else {
        return res.status(400).json(checkResource);
    };
    
    
}

function validateResource(data){
    if (!data.name) return { status: 'Failed', message: 'Name is required' };
    if (!(validateUrl(data.url))) return { status: 'Failed', message: 'URL not found or invalid ' };        
    if (!data.username) return { status: 'Failed', message: 'Username is required' };
    if (!data.password) return { status: 'Failed', message: 'password is required' };
    return { status:'success'}

}

function validateUrl(string){
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
      
}


module.exports = {
    getAllResources,
    createResource
}