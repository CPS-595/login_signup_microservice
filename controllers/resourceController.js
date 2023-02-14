const Resource = require('../model/Resource');

const getAllResources = async(req, res) => {
    const result = await Resource.find({}).exec();
    res.status(201).json({ status: 'Success', payload: result });
}

const createResource = async (req, res) => {
    const result = await Resource.create({
        "name": req.body.name,
        "password": req.body.password,
        "createdBy": req.body.createdBy,
        "url": req.body.url
    });

    console.log(result);

    res.status(201).json({ status: 'Success', payload: result });
}

module.exports = {
    getAllResources,
    createResource
}