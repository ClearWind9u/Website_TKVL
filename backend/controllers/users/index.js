require('dotenv').config();
const User = require('../../models/User');
const getUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(404).json({ success: false, message: 'No users found' });
    res.status(200).json({ success: true, data: users });
};
const getUserById = async (req,res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ success: false, message: 'Please provide an id' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
}

module.exports = { getUsers, getUserById };