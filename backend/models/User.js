const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    userName: String,
    email: String,
    password: String,
    birthDate: Date,
    address: String,
    role: String
}); 
module.exports = mongoose.model('User', UserSchema);