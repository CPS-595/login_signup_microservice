const Resource = require('../model/Resource');
const EncryptedPassword =  require('../model/EncryptedPassword')

const getAllResources = async(req, res) => {
    const result = await Resource.find({}).exec();
    res.status(201).json({ status: 'Success', payload: result });
}

const createResource = async (req, res) => {

    var checkResource = validateResource(req.body)
    if (checkResource.status === 'success'){

        let result = await Resource.create({
            "name": req.body.name,
            "createdBy": req.body.createdBy,
            "url": req.body.url
        });
    
        const password = await EncryptedPassword.create({
            "userId": req.body.createdBy,
            "credentialId": result._id,
            "password": req.body.password

        });

        let payload = {
            "name": result.name,
            "url": result.url,
            "createdBy": result.createdBy,
            "_id": result._id,
            "dateTime": result.dateTime,
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
    if (!data.password) return { status: 'Failed', message: 'password is required' };
    if (!data.createdBy) return { status: 'Failed', message: 'createdByis required' };
    if (!(validateUrl(data.url))) return { status: 'Failed', message: 'URL not found or invalid ' };
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