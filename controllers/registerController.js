const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { email, password, name, number } = req.body;
    if (!name) return res.status(400).json({ status: 'Failed', message: 'Name is required' });
    if (!email) return res.status(400).json({ status: 'Failed', 'message': 'Email is required' });
    if (!validateEmail(email)) return res.status(400).json({ status: 'Failed', 'message': 'Invalid Email' });
    if (!number) return res.status(400).json({ status: 'Failed', 'message': 'Number is required' });
    if (!password) return res.status(400).json({ status: 'Failed', 'message': 'Password is required' });
    if (password.length < 6 || password.length > 20) return res.status(400).json({ status: 'Failed', 'message': 'Password should be between 6 and 20 characters' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email: email }).exec();
    if (duplicate) return res.status(409).json({ status: 'Failed', 'message': 'This user already exists' }); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
        const result = await User.create({
            "email": email,
            "password": hashedPwd,
            "name": name,
            "number": number
        });

        console.log(result);

        res.status(201).json({ status: 'Success', payload: result });
    } catch (err) {
        res.status(500).json({ status: 'Failed', 'message': err.message });
    }
}

function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        return (true)
    }        return (false)
}

module.exports = { handleNewUser };