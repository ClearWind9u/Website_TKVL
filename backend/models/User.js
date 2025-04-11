const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    userName: String,
    userEmail: String,
    password: String,
    dayofBirth: Date,
    address: String,
    role: String,
    CVs: [
        {
            cvLink: String,
            cvName: String
        }
    ]
}); 
module.exports = mongoose.model('User', UserSchema);