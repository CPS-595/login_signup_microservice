const getAllUsers = (req, res) => {
    // return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    res.status(200).json([{'user': 'anisha'}]);
}

module.exports = {
    getAllUsers
}